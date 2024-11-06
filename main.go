package main

import (
	"fmt"
	"log"
	"net"

	loggerserver "github.com/log-engine/logengine/logger"
	"github.com/log-engine/logengine/logger-definitions"
	"google.golang.org/grpc"
)

func main() {
	lis, err := net.Listen("tcp", ":30001")

	if err != nil {
		log.Fatalf("can't create listener %s", err)
	}

	fmt.Printf("logger-engine open port %s \n", lis.Addr())

	loggerRegistrar := grpc.NewServer()

	loggerServer := &loggerserver.LoggerServer{}

	logger.RegisterLoggerServer(loggerRegistrar, loggerServer)

	if err := loggerRegistrar.Serve(lis); err != nil {
		log.Fatalf("can't serve %s", err)
	}

}
