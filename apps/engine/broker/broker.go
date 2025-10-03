package broker

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"logengine/libs/datasource"
	"logengine/libs/utils"
	"time"

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
	var err error

	b.conn, err = amqp.Dial(b.uri)

	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	b.initChannel()

	b.ch.ExchangeDeclare(LOG_EXCHANGE, "direct", true, false, false, false, nil)

	b.initQueue(LOG_QUEUE)

	b.ch.QueueBind(LOG_QUEUE, LOG_QUEUE, LOG_EXCHANGE, false, nil)

	dbUrl := utils.GetEnv("DB_URI")
	database := datasource.NewDatasource(dbUrl, "postgres")

	b.DB = database.Db

	log.Println("connected to rabbitmq successfully")
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
		log.Printf("connection or channel is not open")
	}

	body, err := json.Marshal(lnewLog)
	if err != nil {
		return err
	}

	log.Printf("new message to publish %v", lnewLog)

	err = b.ch.Publish(LOG_EXCHANGE, LOG_QUEUE, false, false, amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
	})
	if err != nil {
		return fmt.Errorf("failed to publish message: %v", err)
	}

	return nil
}

func (b *Broker) ConsumeLog() error {
	if b.conn == nil || b.ch == nil {
		return fmt.Errorf("connection or channel is not open")
	}

	msgs, err := b.ch.Consume(LOG_QUEUE, LOG_QUEUE, true, false, false, false, nil)
	if err != nil {
		return err
	}

	errChan := make(chan error)

	go func() {
		for msg := range msgs {
			log.Printf("new message received from queue %v , %v", LOG_QUEUE, string(msg.Body))

			var newLog logengine_grpc.Log
			err := json.Unmarshal(msg.Body, &newLog)
			if err != nil {
				log.Printf("failed to unmarshal message: %v", err)
				errChan <- err
				continue
			}

			const query = `insert into log (id, level, pid, hostname, ts, message, "appId") values ($1, $2, $3, $4, $5, $6, $7)`

			ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

			defer cancel()

			loc, _ := time.LoadLocation("UTC")

			ts, err := time.ParseInLocation("2006-01-02T15:04:05.000Z", newLog.Ts, loc)

			if err != nil {
				log.Printf("Error parsing date: %v", err)
			}

			r, err := b.DB.ExecContext(ctx, query, uuid.New().String(), newLog.Level, newLog.Pid, newLog.Hostname, ts, newLog.Message, newLog.AppId)

			if err != nil {
				log.Printf("failed to insert log: %v", err)
				errChan <- err
				continue
			}

			log.Printf("log inserted successfully: %v", r)

		}
	}()

	// Vous pouvez retourner une erreur si elle est reçue sur errChan
	return <-errChan
}
