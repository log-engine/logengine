package ratelimit

import (
	"sync"
	"time"
)

// RateLimiter implémente un rate limiter basé sur le Token Bucket algorithm
type RateLimiter struct {
	mu           sync.Mutex
	buckets      map[string]*bucket
	rate         int           // Nombre de requêtes autorisées
	interval     time.Duration // Par intervalle
	bucketSize   int           // Taille maximale du bucket
	cleanupTimer *time.Ticker
}

type bucket struct {
	tokens     int
	lastRefill time.Time
	mu         sync.Mutex
}

// NewRateLimiter crée un nouveau rate limiter
// rate: nombre de requêtes autorisées par interval
// interval: période de temps (ex: 1 seconde)
func NewRateLimiter(rate int, interval time.Duration) *RateLimiter {
	rl := &RateLimiter{
		buckets:    make(map[string]*bucket),
		rate:       rate,
		interval:   interval,
		bucketSize: rate,
	}

	// Cleanup des vieux buckets toutes les 5 minutes
	rl.cleanupTimer = time.NewTicker(5 * time.Minute)
	go rl.cleanup()

	return rl
}

// Allow vérifie si une requête est autorisée pour une clé donnée (ex: appId, IP)
func (rl *RateLimiter) Allow(key string) bool {
	rl.mu.Lock()
	b, exists := rl.buckets[key]
	if !exists {
		b = &bucket{
			tokens:     rl.bucketSize,
			lastRefill: time.Now(),
		}
		rl.buckets[key] = b
	}
	rl.mu.Unlock()

	b.mu.Lock()
	defer b.mu.Unlock()

	// Refill les tokens en fonction du temps écoulé
	now := time.Now()
	elapsed := now.Sub(b.lastRefill)
	tokensToAdd := int(elapsed / rl.interval * time.Duration(rl.rate))

	if tokensToAdd > 0 {
		b.tokens += tokensToAdd
		if b.tokens > rl.bucketSize {
			b.tokens = rl.bucketSize
		}
		b.lastRefill = now
	}

	// Vérifier si on a des tokens disponibles
	if b.tokens > 0 {
		b.tokens--
		return true
	}

	return false
}

// GetRemaining retourne le nombre de tokens restants pour une clé
func (rl *RateLimiter) GetRemaining(key string) int {
	rl.mu.Lock()
	b, exists := rl.buckets[key]
	rl.mu.Unlock()

	if !exists {
		return rl.bucketSize
	}

	b.mu.Lock()
	defer b.mu.Unlock()
	return b.tokens
}

// cleanup supprime les buckets inactifs
func (rl *RateLimiter) cleanup() {
	for range rl.cleanupTimer.C {
		rl.mu.Lock()
		now := time.Now()
		for key, b := range rl.buckets {
			b.mu.Lock()
			if now.Sub(b.lastRefill) > 10*time.Minute {
				delete(rl.buckets, key)
			}
			b.mu.Unlock()
		}
		rl.mu.Unlock()
	}
}

// Stop arrête le rate limiter
func (rl *RateLimiter) Stop() {
	if rl.cleanupTimer != nil {
		rl.cleanupTimer.Stop()
	}
}
