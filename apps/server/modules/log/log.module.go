package log

import (
	"database/sql"

	"logengine/apps/server/middleware"

	"github.com/gin-gonic/gin"
)

type LogModule struct {
	db     *sql.DB
	router *gin.Engine
}

func NewLogModule(db *sql.DB, router *gin.Engine) *LogModule {
	return &LogModule{db: db, router: router}
}

func (m *LogModule) Bootstrap() {
	logGroupRouter := m.router.Group("/logs")

	logGroupRouter.Use(middleware.Authorization(m.db))

	logService := NewLogService(m.db)
	logController := NewLogController(m.router, logService)

	logGroupRouter.GET("", logController.GetLogs)
	logGroupRouter.GET("/stats", logController.GetStats)
}
