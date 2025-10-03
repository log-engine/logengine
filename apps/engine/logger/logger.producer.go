package logger

import (
	"database/sql"
	"log"
	"logengine/apps/engine/broker"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"logengine/libs/utils"

	"github.com/joho/godotenv"
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
	if err := lp.broker.NewLog(newLog); err != nil {
		log.Printf("can't publish log %s", err)
	}
}

func (lp *LogProducer) GetDB() *sql.DB {
	return lp.broker.DB
}
