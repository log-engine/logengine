package logger

import (
	"context"
	"fmt"

	logengine_grpc "logengine.grpc/logger-definitions"
)

var producer = NewLogProducer()

func (lg *LoggerServer) AddLog(req context.Context, payload *logengine_grpc.Log) (*logengine_grpc.LogResponse, error) {
	fmt.Printf("receive new log for app %s payload %v \n", payload.AppId, payload)

	producer.Produce(payload)

	return &logengine_grpc.LogResponse{
		Code: "",
	}, nil
}
