package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashP hashes a password using bcrypt with default cost (10)
func HashP(password string) (string, error) {
	if len(password) > 72 {
		return "", fmt.Errorf("password too long (max 72 bytes for bcrypt)")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %v", err)
	}

	return string(hashedPassword), nil
}

// CompareP compares a hashed password with a plain text password
func CompareP(hashedP string, plainP string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedP), []byte(plainP))
	return err == nil
}
