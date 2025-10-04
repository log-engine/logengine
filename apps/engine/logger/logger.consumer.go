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
	// Charger .env seulement en développement (optionnel en production)
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found, using environment variables")
	}

	rbUri := utils.GetEnv("RABBITMQ_URI")
	lp.broker = broker.NewBroker(rbUri)
	lp.broker.Init()
	log.Println("broker consumer is init successfully")
}

func (lc *LogConsumer) Consume() {
	log.Println("Starting log consumer...")
	lc.broker.ConsumeLog()
	log.Println("Log consumer stopped")
}

func (lc *LogConsumer) Close() {
	log.Println("Closing consumer connections...")
	lc.broker.Close()
}
