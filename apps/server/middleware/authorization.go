package middleware

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"strings"
	"time"

	"logengine/apps/server/types"

	"github.com/gin-gonic/gin"
)

func Authorization(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.GetHeader("Authorization")

		log.Printf("authorization: %v", authorization)

		if authorization == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, &map[string]string{
				"code": "UNAUTHORIZED",
			})
		}

		token := strings.Split(authorization, " ")[1]

		query := `
			select u.id, u.username, u.role, u.apps 
			from "user" u 
			inner join token t on u.id = t."userId"
			where t.token = $1 and t."expiredAt" > $2
		`

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

		defer cancel()

		row := db.QueryRowContext(ctx, query, token, time.Now())

		if row.Err() != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, &map[string]string{
				"code": "UNAUTHORIZED",
			})
		}

		user := types.User{}

		row.Scan(&user.Id, &user.Username, &user.Role, &user.Apps)

		log.Printf("logged user: %v", user)

		c.Set("me", user)

		c.Next()
	}
}
