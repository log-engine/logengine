package app

import (
	"logengine/apps/server/modules/application"
	"logengine/apps/server/modules/user"
	"logengine/libs/datasource"
	"logengine/libs/utils"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// func Tokenizer(db *sql.DB) gin.HandlerFunc {
// 	return func(c *gin.Context) {

// 		token := c.GetHeader("Authorization")

// 	}
// }

func Bootstrap(r *gin.Engine) {
	dbUrl := utils.GetEnv("DB_URI")
	database := datasource.NewDatasource(dbUrl, "postgres")

	application.NewApplicationModule(database.Db, r).Bootstrap()
	user.NewUserModule(database.Db, r).Bootstrap()
}
