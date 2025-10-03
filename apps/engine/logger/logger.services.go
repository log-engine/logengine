package logger

import (
	"context"
	"log"
	"net/http"
	"time"

	logengine_grpc "logengine/apps/engine/logger-definitions"
)

func (lg *LoggerServer) AddLog(req context.Context, payload *logengine_grpc.Log) (*logengine_grpc.LogResponse, error) {
	// Validation des données d'entrée
	if payload.AppId == "" {
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusBadRequest,
			Message: "appId is required",
		}, nil
	}

	if payload.Level == "" {
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusBadRequest,
			Message: "level is required",
		}, nil
	}

	if !ValidLogLevels[payload.Level] {
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusBadRequest,
			Message: "invalid log level (must be: debug, info, warn, error, fatal)",
		}, nil
	}

	if payload.Message == "" {
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusBadRequest,
			Message: "message is required",
		}, nil
	}

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
	if err := row.Scan(&appId); err != nil {
		log.Printf("app id not found: %v", err)
		return &logengine_grpc.LogResponse{
			Code:    "failed",
			Status:  http.StatusUnauthorized,
			Message: "invalid app key",
		}, nil
	}

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
