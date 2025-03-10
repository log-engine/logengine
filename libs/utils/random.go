package utils

import (
	"crypto/rand"
	"encoding/hex"
	"log"
)

func GenerateStr(length int) string {
	bytes := make([]byte, length/2)
	_, err := rand.Read(bytes)
	if err != nil {
		log.Fatal(err)
	}

	return hex.EncodeToString(bytes)
}
