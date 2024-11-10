package logger

import logengine_grpc "logengine.grpc/logger-definitions"


type LoggerServer struct {
	logengine_grpc.UnimplementedLoggerServer
}
