package logger

import (
	"context"
	logengine_grpc "logengine/apps/engine/logger-definitions"
)

func (lg *LoggerServer) AddLog(req context.Context, payload *logengine_grpc.Log) (*logengine_grpc.LogResponse, error) {

	lg.logProducer.Produce(payload)

	return &logengine_grpc.LogResponse{
		Code: "",
	}, nil
}
