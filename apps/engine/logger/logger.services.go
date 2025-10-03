package logger

import (
	"context"
	"log"
	logengine_grpc "logengine/apps/engine/logger-definitions"
	"net/http"
	"time"
)

func (lg *LoggerServer) AddLog(req context.Context, payload *logengine_grpc.Log) (*logengine_grpc.LogResponse, error) {
	query := `select id from app where key = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	row := lg.logProducer.broker.DB.QueryRowContext(ctx, query, payload.AppId)

	if row.Err() != nil {
		log.Printf("can't log : %v", row.Err())
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusBadRequest,
			Message: "can't log, invalid app id",
		}, nil
	}

	var appId string

	row.Scan(&appId)

	var payloadToPublish *logengine_grpc.Log = &logengine_grpc.Log{
		Level:    payload.GetLevel(),
		Message:  payload.GetMessage(),
		Pid:      payload.GetPid(),
		Hostname: payload.GetHostname(),
		AppId:    appId,
		Ts:       payload.GetTs(),
	}

	lg.logProducer.Produce(payloadToPublish)

	return &logengine_grpc.LogResponse{
		Code:    "ok",
		Status:  http.StatusOK,
		Message: "log added",
	}, nil
}
