package application

import (
	"database/sql"

	"logengine/apps/server/middleware"

	"github.com/gin-gonic/gin"
)

type ApplicationModule struct {
	db     *sql.DB
	router *gin.Engine
}

func NewApplicationModule(db *sql.DB, router *gin.Engine) *ApplicationModule {
	return &ApplicationModule{db: db, router: router}
}

func (appM *ApplicationModule) Bootstrap() {

	userGroupRouter := appM.router.Group("applications")
	adminGroupRouter := appM.router.Group("applications")

	userGroupRouter.Use(middleware.Authorization(appM.db))
	adminGroupRouter.Use(middleware.Authorization(appM.db))
	adminGroupRouter.Use(middleware.IsAdmin(appM.db))

	appService := NewApplicationService(appM.db)
	appController := NewApplicationController(appM.router, appService)

	userGroupRouter.GET("/", appController.FindApps)
	adminGroupRouter.POST("/", appController.CreateApp)
}
