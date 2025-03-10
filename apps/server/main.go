package main

import (
	"log"
	"logengine/apps/server/middleware"
	app "logengine/apps/server/modules"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()

	r.Use(middleware.RequestLogger())

	if err := godotenv.Load(); err != nil {
		log.Fatalf("can't load .env file %s", err)
	}

	app.Bootstrap(r)

	r.Run(":8080")
}
