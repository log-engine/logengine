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
	// Charger .env seulement en développement (optionnel en production)
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found, using environment variables")
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

func (lp *LogProducer) Close() {
	log.Println("Closing producer connections...")
	lp.broker.Close()
}
