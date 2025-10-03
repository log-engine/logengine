# Génération des fichiers protobuf
generate_proto:
	protoc \
		--go_out=. \
		--go_opt=paths=source_relative \
		--go-grpc_out=. \
		--go-grpc_opt=paths=source_relative \
		apps/engine/logger-definitions/logger.proto

# Lancement du serveur HTTP
run_http_server:
	go run ./apps/server/main.go

# Lancement du serveur gRPC
run_grpc_server:
	go run ./apps/engine/main.go

# Cible par défaut pour afficher l'aide
.PHONY: help
help:
	@echo "Commandes disponibles:"
	@echo "  make generate_proto    - Génère les fichiers Go à partir du proto"
	@echo "  make run-http-server  - Lance le serveur HTTP"
	@echo "  make run-grpc-server  - Lance le serveur gRPC"