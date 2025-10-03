package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"logengine/apps/server/middleware"
	app "logengine/apps/server/modules"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()
	gin.SetMode(gin.DebugMode)

	r.Use(middleware.RequestLogger())
	r.Use(middleware.RateLimitMiddleware())

	if err := godotenv.Load(); err != nil {
		log.Fatalf("can't load .env file %s", err)
	}

	app.Bootstrap(r)

	// Créer le serveur HTTP
	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Canal pour gérer le graceful shutdown
	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	// Démarrer le serveur dans une goroutine
	go func() {
		log.Printf("HTTP server started on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Attendre le signal de shutdown
	sig := <-shutdownChan
	log.Printf("Received signal %v, initiating graceful shutdown...", sig)

	// Créer un contexte avec timeout pour le shutdown (30s)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Arrêter gracefully le serveur
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server shutdown complete")
}
