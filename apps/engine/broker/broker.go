package broker

import (
	"encoding/json"
	"fmt"
	"log"
	logengine_grpc "logengine/apps/engine/logger-definitions"

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
}

func NewBroker(uri string) *Broker {
	b := &Broker{uri: uri}
	return b
}

func (b *Broker) Init() {
	conn, err := amqp.Dial(b.uri)

	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	log.Println("connected to rabbitmq successfully")

	b.conn = conn

	b.initChannel()

	b.ch.ExchangeDeclare(LOG_EXCHANGE, "direct", true, false, false, false, nil)

	b.initQueue(LOG_QUEUE)

	b.ch.ExchangeBind(LOG_QUEUE, LOG_EXCHANGE, LOG_QUEUE, false, nil)
}

func (b *Broker) initChannel() {
	ch, err := b.conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	log.Printf("channel %v opened successfully", ch)
	b.ch = ch
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

	body, err := json.Marshal(lnewLog)
	if err != nil {
		return err
	}

	log.Printf("new message to publish channel %v", b.ch)

	err = b.ch.Publish(LOG_EXCHANGE, LOG_QUEUE, false, true, amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
	})
	if err != nil {
		return fmt.Errorf("failed to publish message: %v", err)
	}

	log.Printf("new message published on queue %v", LOG_QUEUE)

	return nil
}

func (b *Broker) ConsumeLog() error {
	msgs, err := b.ch.Consume(LOG_QUEUE, LOG_QUEUE, true, false, false, false, nil)
	if err != nil {
		return err
	}

	errChan := make(chan error)

	go func() {
		for msg := range msgs {
			fmt.Println("new message received from queue", LOG_QUEUE)
			fmt.Println(string(msg.Body))
			// Si une erreur se produit, vous pouvez la capturer ici
			// errChan <- someError
		}
	}()

	// Vous pouvez retourner une erreur si elle est reçue sur errChan
	return <-errChan
}
