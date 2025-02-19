package app

import (
	"logengine/apps/server/modules/application"
	"logengine/libs/datasource"
	"logengine/libs/utils"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func Bootstrap(r *gin.Engine) {
	dbUrl := utils.GetEnv("DB_URI")
	database := datasource.NewDatasource(dbUrl, "postgres")
	application.NewApplicationModule(database.Db, r).Bootstrap()
}
