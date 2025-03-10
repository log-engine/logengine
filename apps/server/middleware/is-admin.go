package middleware

import (
	"context"
	"database/sql"
	"log"
	"logengine/apps/server/types"
	"logengine/libs/datasource"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func IsAdmin(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		me := c.MustGet("me").(types.User)

		if me.Id == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, &map[string]string{
				"code": "NOT_ALLOW_TO_PERFORM_THIS_ACTION",
			})
		}

		query := `select id from "user" where id = $1 and role = $2`

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

		defer cancel()

		row := db.QueryRowContext(ctx, query, me.Id, datasource.ADMINROLE)

		if row.Err() != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, &map[string]string{
				"code": "NOT_ALLOW_TO_PERFORM_THIS_ACTION",
			})
		}

		userId := ""

		row.Scan(&userId)

		log.Printf("admin user: %v", userId)

		if userId == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, &map[string]string{
				"code": "NOT_ALLOW_TO_PERFORM_THIS_ACTION",
			})
		}

		c.Next()
	}
}
