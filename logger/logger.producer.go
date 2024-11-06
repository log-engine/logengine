package logger

import (
	"fmt"
	"log"

	"github.com/log-engine/logengine/broker"
	"github.com/log-engine/logengine/logger-definitions"
)

type LogProducer struct {
	broker *broker.Broker
}

func NewLogProducer() *LogProducer {
	lp := &LogProducer{}
	lp.init()
	return lp
}

func (lp *LogProducer) init() {
	rbUri := "amqp://guest:guest@localhost:5672/"
	lp.broker = broker.NewBroker(rbUri)
	log.Println("producer broker is init successfully")
}

func (lp *LogProducer) Produce(log *logger.Log) {

	fmt.Println(lp.broker)

	err := lp.broker.NewLog(broker.LOG_QUEUE, log)

	if err != nil {
		panic(err)
	}
}
