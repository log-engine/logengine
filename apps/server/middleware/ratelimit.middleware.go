package middleware

import (
	"net/http"
	"time"

	"logengine/libs/ratelimit"

	"github.com/gin-gonic/gin"
)

var (
	// Rate limiter global: 100 requêtes par seconde par IP
	globalLimiter = ratelimit.NewRateLimiter(100, 1*time.Second)
)

// RateLimitMiddleware limite le nombre de requêtes par IP
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		if !globalLimiter.Allow(clientIP) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"code":    "RATE_LIMIT_EXCEEDED",
				"message": "Too many requests, please slow down",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
