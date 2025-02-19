package application

import (
	"database/sql"

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

	r := appM.router.Group("applications")

	appService := NewApplicationService(appM.db)
	appController := NewApplicationController(appM.router, appService)

	r.GET("/", appController.FindApps)
	r.POST("/", appController.CreateApp)
}
