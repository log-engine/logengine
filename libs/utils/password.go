package utils

import (
	"log"

	"golang.org/x/crypto/bcrypt"
)

func HashP(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		log.Fatal(err)
	}

	return string(hashedPassword)
}

func CompareP(hashedP string, plainP string) bool {
	byteHash := []byte(hashedP)
	err := bcrypt.CompareHashAndPassword(byteHash, []byte(plainP))
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
