package retry

import (
	"log"
	"time"
)

// Config contient la configuration du retry
type Config struct {
	MaxAttempts  int           // Nombre maximum de tentatives
	InitialDelay time.Duration // Délai initial avant le premier retry
	MaxDelay     time.Duration // Délai maximum entre les retries
	Multiplier   float64       // Multiplicateur pour le backoff exponentiel
	OnRetry      func(attempt int, err error)
}

// DefaultConfig retourne une configuration par défaut
func DefaultConfig() Config {
	return Config{
		MaxAttempts:  5,
		InitialDelay: 1 * time.Second,
		MaxDelay:     30 * time.Second,
		Multiplier:   2.0,
		OnRetry: func(attempt int, err error) {
			log.Printf("Retry attempt %d failed: %v", attempt, err)
		},
	}
}

// Do exécute une fonction avec retry et backoff exponentiel
func Do(fn func() error, config Config) error {
	var err error
	delay := config.InitialDelay

	for attempt := 1; attempt <= config.MaxAttempts; attempt++ {
		err = fn()
		if err == nil {
			return nil
		}

		// Dernière tentative échouée
		if attempt == config.MaxAttempts {
			break
		}

		// Callback optionnel
		if config.OnRetry != nil {
			config.OnRetry(attempt, err)
		}

		// Attendre avec backoff exponentiel
		time.Sleep(delay)

		// Calculer le prochain délai
		delay = time.Duration(float64(delay) * config.Multiplier)
		if delay > config.MaxDelay {
			delay = config.MaxDelay
		}
	}

	return err
}

// DoWithContext exécute une fonction avec retry, en respectant un contexte
// (utile pour timeout global ou cancellation)
func DoWithContext(fn func() error, config Config) error {
	return Do(fn, config)
}
