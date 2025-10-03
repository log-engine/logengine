package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"logengine/apps/engine/logger"
	logengine_grpc "logengine/apps/engine/logger-definitions"

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

	logProducer := logger.NewLogProducer()
	logProducer.Init()

	// Créer l'intercepteur d'authentification
	authInterceptor := logger.NewAuthInterceptor(logProducer.GetDB())

	// Créer le serveur gRPC avec l'intercepteur
	loggerRegistrar := grpc.NewServer(
		grpc.UnaryInterceptor(authInterceptor.UnaryInterceptor),
	)

	loggerServer := logger.NewLoggerServer(logProducer)

	logengine_grpc.RegisterLoggerServer(loggerRegistrar, loggerServer)

	loggerConsumer := logger.NewLogConsumer()
	loggerConsumer.Init()

	// Canal pour gérer le graceful shutdown
	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		log.Println("start consuming")
		loggerConsumer.Consume()
	}()

	// Serveur gRPC dans une goroutine
	go func() {
		log.Printf("gRPC server started on %s", lis.Addr())
		if err := loggerRegistrar.Serve(lis); err != nil {
			log.Fatalf("can't serve %s", err)
		}
	}()

	// Attendre le signal de shutdown
	sig := <-shutdownChan
	log.Printf("Received signal %v, initiating graceful shutdown...", sig)

	// Créer un contexte avec timeout pour le shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Arrêter gracefully le serveur gRPC
	log.Println("Stopping gRPC server...")
	stopped := make(chan struct{})
	go func() {
		loggerRegistrar.GracefulStop()
		close(stopped)
	}()

	select {
	case <-stopped:
		log.Println("gRPC server stopped gracefully")
	case <-ctx.Done():
		log.Println("Shutdown timeout exceeded, forcing stop")
		loggerRegistrar.Stop()
	}

	// Attendre que le consumer finisse de traiter les messages en cours
	log.Println("Waiting for consumer to finish processing messages...")
	time.Sleep(2 * time.Second) // Temps pour que le consumer finisse

	// Fermer les connexions proprement
	loggerConsumer.Close()
	logProducer.Close()

	log.Println("Shutdown complete")
}
