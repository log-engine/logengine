package logger

import (
	"log"
	"logengine/apps/engine/broker"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"logengine/libs/utils"

	"github.com/joho/godotenv"
	// "logengine.grpc/broker"
	// logengine_grpc "logengine.grpc/logger-definitions"
	// logengine_grpc "logengine.grpc/logger-definitions"
)

type LogProducer struct {
	broker *broker.Broker
}

func NewLogProducer() *LogProducer {
	lp := &LogProducer{}
	return lp
}

func (lp *LogProducer) Init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("can't load .env file %s", err)
	}

	rbUri := utils.GetEnv("RABBITMQ_URI")
	lp.broker = broker.NewBroker(rbUri)
	lp.broker.Init()
	log.Println("producer broker is init successfully")
}

func (lp *LogProducer) Produce(newLog *logengine_grpc.Log) {

	err := lp.broker.NewLog(newLog)

	if err != nil {
		log.Printf("can't publish log %s", err)
	}
}
