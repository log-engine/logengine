package broker

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/log-engine/logengine/logger-definitions"
	amqp "github.com/rabbitmq/amqp091-go"
)

type Broker struct {
	uri  string
	conn *amqp.Connection
	ch   *amqp.Channel
}

func NewBroker(uri string) *Broker {
	b := &Broker{uri: uri}
	b.init()
	return b
}

func (b *Broker) init() {
	conn, err := amqp.Dial(b.uri)

	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	// don't forget to close the connection
	// defer conn.Close()
	b.conn = conn

	b.ch = initChannel(conn)
	// defer b.ch.Close()
}

func initChannel(conn *amqp.Connection) *amqp.Channel {
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	return ch
}

func (b *Broker) NewLog(queueName string, log *logger.Log) error {
	queue, err := b.ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	body, err := json.Marshal(log)
	if err != nil {
		return err
	}
	fmt.Println("new message published on queue", queue.Name)
	return b.ch.PublishWithContext(ctx, "", queue.Name, false, false, amqp.Publishing{
		ContentType: "application/json",
		Body:        body,
	})
}

func (b *Broker) ConsumeLog(queueName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	msgs, err := b.ch.ConsumeWithContext(ctx, queueName, "", true, false, false, false, nil)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			fmt.Println("new message received from queue", queueName)
			fmt.Println(string(msg.Body))

		}
	}()

	<-ctx.Done()

	return nil
}
