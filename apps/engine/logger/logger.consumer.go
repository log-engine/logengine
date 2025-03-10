package logger

import (
	"log"
	"logengine/apps/engine/broker"
	"logengine/libs/utils"

	"github.com/joho/godotenv"
)

type LogConsumer struct {
	broker *broker.Broker
}

func NewLogConsumer() *LogConsumer {
	lc := &LogConsumer{}
	return lc
}

func (lp *LogConsumer) Init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("can't load .env file %s", err)
	}

	rbUri := utils.GetEnv("RABBITMQ_URI")
	lp.broker = broker.NewBroker(rbUri)
	lp.broker.Init()
	log.Println("broker consumer is init successfully")
}

func (lc *LogConsumer) Consume() {
	err := lc.broker.ConsumeLog()
	if err != nil {
		log.Printf("can't consume log %s", err)
	}
}
