package appTyping

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type IAppModule interface {
	Bootstrap(db *sql.DB, router *gin.Engine)
}

type SAppModule struct {
	db     *sql.DB
	router *gin.Engine
}

type BadRequest struct {
	Code    string
	Message string
}
