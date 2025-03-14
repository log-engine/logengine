package logger

import logengine_grpc "logengine/apps/engine/logger-definitions"

// import logengine_grpc "logengine.grpc/logger-definitions"

type LoggerServer struct {
	logengine_grpc.UnimplementedLoggerServer
	logProducer *LogProducer
}

func NewLoggerServer(logProducer *LogProducer) *LoggerServer {
	return &LoggerServer{
		logProducer: logProducer,
	}
}
