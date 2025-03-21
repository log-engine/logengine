package main

import (
	"fmt"
	"log"
	"logengine/apps/engine/logger"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"net"

	"google.golang.org/grpc"
	// "logengine.grpc/logger"
	// logengine_grpc "logengine.grpc/logger-definitions"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("can't load .env file %s", err)
	}

	lis, err := net.Listen("tcp", ":30001")

	if err != nil {
		log.Fatalf("can't create listener %s", err)
	}

	fmt.Printf("logger-engine open port %s \n", lis.Addr())

	loggerRegistrar := grpc.NewServer()

	logProducer := logger.NewLogProducer()

	logProducer.Init()

	loggerServer := logger.NewLoggerServer(logProducer)

	logengine_grpc.RegisterLoggerServer(loggerRegistrar, loggerServer)

	loggerConsumer := logger.NewLogConsumer()
	loggerConsumer.Init()

	go func() {
		log.Println("start consuming")
		loggerConsumer.Consume()
	}()

	if err := loggerRegistrar.Serve(lis); err != nil {
		log.Fatalf("can't serve %s", err)
	}

	log.Printf("server started ...")

}
