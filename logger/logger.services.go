package loggerserver

import (
	"context"

	"github.com/log-engine/logengine/logger-definitions"
)

func (lg *LoggerServer) AddLog(context.Context, *logger.Log) (*logger.LogResponse, error) {
	return &logger.LogResponse{
		Code: "",
	}, nil
}
