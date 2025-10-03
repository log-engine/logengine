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

# Formatage du code
fmt:
	@echo "Formatage du code Go..."
	@gofmt -w .
	@$(shell go env GOPATH)/bin/goimports -w -local logengine .
	@echo "✅ Code formaté!"

# Vérification du formatage
fmt-check:
	@echo "Vérification du formatage..."
	@test -z "$$(gofmt -l .)" || (echo "Les fichiers suivants ne sont pas formatés:" && gofmt -l . && exit 1)

# Linting
lint:
	@echo "Analyse du code avec golangci-lint..."
	golangci-lint run ./...

# Installation des outils de dev
install-tools:
	@echo "Installation des outils de développement..."
	go install golang.org/x/tools/cmd/goimports@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Build des deux serveurs
build:
	@echo "Compilation du serveur HTTP..."
	go build -o bin/http-server ./apps/server/main.go
	@echo "Compilation du serveur gRPC..."
	go build -o bin/grpc-server ./apps/engine/main.go
	@echo "✅ Build terminé!"

# Tests
test:
	@echo "Exécution des tests..."
	go test -v ./...

# Clean
clean:
	@echo "Nettoyage..."
	rm -rf bin/
	go clean

# Docker
docker-up:
	@echo "Démarrage de PostgreSQL et RabbitMQ..."
	docker-compose up -d
	@echo "✅ Services démarrés!"
	@echo "PostgreSQL: localhost:5432"
	@echo "RabbitMQ: localhost:5672 (UI: http://localhost:15672)"

docker-down:
	@echo "Arrêt des services Docker..."
	docker-compose down

docker-logs:
	docker-compose logs -f

# Setup du projet
setup:
	@echo "Configuration du projet..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ Fichier .env créé"; fi
	@make install-tools
	@make docker-up
	@echo ""
	@echo "✅ Projet configuré!"
	@echo "Modifie le fichier .env si nécessaire, puis lance:"
	@echo "  make run_grpc_server  (Terminal 1)"
	@echo "  make run_http_server  (Terminal 2)"

# Tests système
test-system:
	@chmod +x scripts/test-system.sh
	@scripts/test-system.sh

# Cible par défaut pour afficher l'aide
.PHONY: help
help:
	@echo "Commandes disponibles:"
	@echo ""
	@echo "🚀 Démarrage rapide:"
	@echo "  make setup             - Configure le projet (première utilisation)"
	@echo "  make run_http_server   - Lance le serveur HTTP (port 8080)"
	@echo "  make run_grpc_server   - Lance le serveur gRPC (port 30001)"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make docker-up         - Démarre PostgreSQL et RabbitMQ"
	@echo "  make docker-down       - Arrête les services Docker"
	@echo "  make docker-logs       - Affiche les logs Docker"
	@echo ""
	@echo "🔨 Build:"
	@echo "  make build             - Compile les deux serveurs"
	@echo "  make generate_proto    - Génère les fichiers Go à partir du proto"
	@echo "  make clean             - Nettoie les binaires"
	@echo ""
	@echo "✨ Qualité du code:"
	@echo "  make fmt               - Formate tout le code Go"
	@echo "  make fmt-check         - Vérifie le formatage du code"
	@echo "  make lint              - Analyse le code avec golangci-lint"
	@echo ""
	@echo "🧪 Tests:"
	@echo "  make test              - Exécute les tests unitaires"
	@echo "  make test-system       - Exécute les tests système complets"
	@echo ""
	@echo "🛠️  Outils:"
	@echo "  make install-tools     - Installe goimports et golangci-lint"