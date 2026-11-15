package app

import (
	"logengine/apps/server/modules/application"
	"logengine/apps/server/modules/log"
	"logengine/apps/server/modules/user"
	"logengine/libs/datasource"
	"logengine/libs/utils"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func Bootstrap(r *gin.Engine) {
	dbUrl := utils.GetEnv("DB_URI")
	database := datasource.NewDatasource(dbUrl, "postgres")

	user.NewUserModule(database.Db, r).Bootstrap()
	log.NewLogModule(database.Db, r).Bootstrap()
	application.NewApplicationModule(database.Db, r).Bootstrap()
}
