package broker

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	logengine_grpc "logengine/apps/engine/logger-definitions"
	"logengine/libs/datasource"
	"logengine/libs/retry"
	"logengine/libs/utils"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	LOG_QUEUE    = "log.new"
	LOG_EXCHANGE = "log"
)

type Broker struct {
	uri  string
	conn *amqp.Connection
	ch   *amqp.Channel
	q    *amqp.Queue
	DB   *sql.DB
}

func NewBroker(uri string) *Broker {
	b := &Broker{uri: uri}
	return b
}

func (b *Broker) Init() {
	// Connexion à RabbitMQ avec retry
	retryConfig := retry.Config{
		MaxAttempts:  10,
		InitialDelay: 2 * time.Second,
		MaxDelay:     30 * time.Second,
		Multiplier:   1.5,
		OnRetry: func(attempt int, err error) {
			log.Printf("Failed to connect to RabbitMQ (attempt %d): %v", attempt, err)
		},
	}

	err := retry.Do(func() error {
		var err error
		b.conn, err = amqp.Dial(b.uri)
		return err
	}, retryConfig)

	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ after retries: %v", err)
	}

	b.initChannel()

	b.ch.ExchangeDeclare(LOG_EXCHANGE, "direct", true, false, false, false, nil)

	b.initQueue(LOG_QUEUE)

	b.ch.QueueBind(LOG_QUEUE, LOG_QUEUE, LOG_EXCHANGE, false, nil)

	// Connexion à PostgreSQL avec retry
	dbUrl := utils.GetEnv("DB_URI")

	err = retry.Do(func() error {
		database := datasource.NewDatasource(dbUrl, "postgres")
		b.DB = database.Db
		// Test de connexion
		return b.DB.Ping()
	}, retryConfig)

	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL after retries: %v", err)
	}

	log.Println("connected to rabbitmq and postgresql successfully")
}

func (b *Broker) initChannel() {
	var err error

	b.ch, err = b.conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	log.Printf("channel is closed ? '%v'", b.ch.IsClosed())

}

func (b *Broker) initQueue(queueName string) error {
	queue, err := b.ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare a queue: %v", err)
	}

	log.Printf("queue %v declared successfully", queue)

	b.q = &queue
	return nil
}

func (b *Broker) NewLog(lnewLog *logengine_grpc.Log) error {
	if b.conn == nil || b.ch == nil {
		return fmt.Errorf("connection or channel is not open")
	}

	body, err := json.Marshal(lnewLog)
	if err != nil {
		return fmt.Errorf("failed to marshal log: %v", err)
	}

	log.Printf("new message to publish %v", lnewLog)

	// Retry avec backoff exponentiel
	retryConfig := retry.Config{
		MaxAttempts:  3,
		InitialDelay: 100 * time.Millisecond,
		MaxDelay:     2 * time.Second,
		Multiplier:   2.0,
		OnRetry: func(attempt int, err error) {
			log.Printf("Failed to publish to RabbitMQ (attempt %d): %v", attempt, err)
		},
	}

	err = retry.Do(func() error {
		return b.ch.Publish(LOG_EXCHANGE, LOG_QUEUE, false, false, amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})
	}, retryConfig)

	if err != nil {
		return fmt.Errorf("failed to publish message after retries: %v", err)
	}

	return nil
}

func (b *Broker) ConsumeLog() {
	if b.conn == nil || b.ch == nil {
		log.Fatalf("connection or channel is not open")
		return
	}

	msgs, err := b.ch.Consume(LOG_QUEUE, LOG_QUEUE, true, false, false, false, nil)
	if err != nil {
		log.Fatalf("failed to start consuming: %v", err)
		return
	}

	log.Printf("Starting to consume logs from queue: %s", LOG_QUEUE)

	// Précharger la location UTC une seule fois
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		log.Fatalf("failed to load UTC location: %v", err)
		return
	}

	for msg := range msgs {
		log.Printf("new message received from queue %v , %v", LOG_QUEUE, string(msg.Body))

		var newLog logengine_grpc.Log
		if err := json.Unmarshal(msg.Body, &newLog); err != nil {
			log.Printf("failed to unmarshal message: %v", err)
			continue
		}

		const query = `insert into log (id, level, pid, hostname, ts, message, "appId") values ($1, $2, $3, $4, $5, $6, $7)`

		ts, err := time.ParseInLocation("2006-01-02T15:04:05.000Z", newLog.Ts, loc)
		if err != nil {
			log.Printf("Error parsing date: %v, using current time instead", err)
			ts = time.Now().UTC()
		}

		logId := uuid.New().String()

		// Retry avec backoff exponentiel pour PostgreSQL
		retryConfig := retry.Config{
			MaxAttempts:  5,
			InitialDelay: 500 * time.Millisecond,
			MaxDelay:     10 * time.Second,
			Multiplier:   2.0,
			OnRetry: func(attempt int, err error) {
				log.Printf("Failed to insert log into PostgreSQL (attempt %d): %v", attempt, err)
			},
		}

		err = retry.Do(func() error {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			_, err := b.DB.ExecContext(ctx, query, logId, newLog.Level, newLog.Pid, newLog.Hostname, ts, newLog.Message, newLog.AppId)
			return err
		}, retryConfig)

		if err != nil {
			log.Printf("failed to insert log after retries: %v", err)
			// TODO: Mettre dans une dead letter queue ou un fichier de backup
			continue
		}

		log.Printf("log inserted successfully: %s", logId)
	}

	log.Printf("Consumer stopped: channel closed")
}

// Close ferme proprement les connexions RabbitMQ et PostgreSQL
func (b *Broker) Close() {
	log.Println("Closing broker connections...")

	if b.ch != nil {
		if err := b.ch.Close(); err != nil {
			log.Printf("Error closing RabbitMQ channel: %v", err)
		}
	}

	if b.conn != nil {
		if err := b.conn.Close(); err != nil {
			log.Printf("Error closing RabbitMQ connection: %v", err)
		}
	}

	if b.DB != nil {
		if err := b.DB.Close(); err != nil {
			log.Printf("Error closing PostgreSQL connection: %v", err)
		}
	}

	log.Println("Broker connections closed")
}
