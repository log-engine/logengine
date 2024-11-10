package utils

import (
	"log"
	"os"
)

func GetEnv(key string) string {
	value := os.Getenv(key)

	if value == "" {
		log.Fatalf("var '%s' is not defined", key)
	}

	return value
}
