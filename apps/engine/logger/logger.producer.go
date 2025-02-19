package logger

import (
	"fmt"
	"log"
	"logengine/apps/engine/broker"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"logengine/libs/utils"
	"os"
	// "logengine.grpc/broker"
	// logengine_grpc "logengine.grpc/logger-definitions"
	// logengine_grpc "logengine.grpc/logger-definitions"
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
	fmt.Printf("rabbit url", os.Getenv("RABBITMQ_URI"))
	rbUri := utils.GetEnv("RABBITMQ_URI")
	lp.broker = broker.NewBroker(rbUri)
	log.Println("producer broker is init successfully")
}

func (lp *LogProducer) Produce(log *logengine_grpc.Log) {

	fmt.Println(lp.broker)

	err := lp.broker.NewLog(broker.LOG_QUEUE, log)

	if err != nil {
		panic(err)
	}
}
