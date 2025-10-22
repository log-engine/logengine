package log

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type LogController struct {
	router  *gin.Engine
	service *LogService
}

func NewLogController(router *gin.Engine, logService *LogService) *LogController {
	return &LogController{router: router, service: logService}
}

func (c *LogController) GetLogs(ctx *gin.Context) {
	var filters GetLogsFilters

	if err := ctx.ShouldBindQuery(&filters); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameters"})
		return
	}

	logs, err := c.service.GetLogs(&filters)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}

	ctx.JSON(http.StatusOK, logs)
}

func (c *LogController) GetStats(ctx *gin.Context) {
	stats, err := c.service.GetStats()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
		return
	}

	ctx.JSON(http.StatusOK, stats)
}
