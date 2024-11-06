package logger

import (
	"context"
	"fmt"

	"github.com/log-engine/logengine/logger-definitions"
)

var producer = NewLogProducer()

func (lg *LoggerServer) AddLog(req context.Context, payload *logger.Log) (*logger.LogResponse, error) {
	fmt.Printf("receive new log for app %s payload %v \n", payload.AppId, payload)

	producer.Produce(payload)

	return &logger.LogResponse{
		Code: "",
	}, nil
}
