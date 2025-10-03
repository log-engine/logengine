# Guide de démarrage rapide - LogEngine

## Prérequis

- **Go** 1.23+ : `go version`
- **PostgreSQL** : Base de données
- **RabbitMQ** : Message broker
- **protoc** : Compilateur Protocol Buffers

### Installation des prérequis (macOS)

```bash
# Protobuf compiler
brew install protobuf

# PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# RabbitMQ
brew install rabbitmq
brew services start rabbitmq

# Outils Go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install golang.org/x/tools/cmd/goimports@latest
```

---

## Configuration

### 1. Variables d'environnement

Créer un fichier `.env` à la racine :

```bash
# Base de données PostgreSQL
DB_URI=postgres://user:password@localhost:5432/logengine?sslmode=disable

# RabbitMQ
RABBITMQ_URI=amqp://guest:guest@localhost:5672/
```

### 2. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base
CREATE DATABASE logengine;
\c logengine
```

Les tables seront créées automatiquement au premier démarrage (voir `libs/datasource/ddl.go`).

### 3. Installer les dépendances

```bash
go mod tidy
```

---

## Démarrage du projet

### Méthode 1 : Via Makefile (recommandé)

```bash
# Terminal 1 : Serveur gRPC (port 30001)
make run_grpc_server

# Terminal 2 : Serveur HTTP (port 8080)
make run_http_server
```

### Méthode 2 : Directement avec Go

```bash
# Terminal 1 : Serveur gRPC
go run ./apps/engine/main.go

# Terminal 2 : Serveur HTTP
go run ./apps/server/main.go
```

### Méthode 3 : Build puis exécuter

```bash
make build

./bin/grpc-server  # Terminal 1
./bin/http-server  # Terminal 2
```

---

## Tester le système

### 1. Créer un utilisateur (HTTP API)

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Réponse** : `{"token": "xyz..."}`

### 2. Créer une application (HTTP API)

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "My Frontend App"
  }'
```

**Réponse** :
```json
{
  "id": "abc-123",
  "name": "My Frontend App",
  "key": "xxxxxxxxxxxxxxxxxxx"
}
```

**⚠️ Copie la `key`, tu en auras besoin pour envoyer des logs !**

### 3. Envoyer un log via gRPC

Installe `grpcurl` :
```bash
brew install grpcurl
```

Envoie un log :
```bash
grpcurl -plaintext \
  -H "x-api-key: <ta-clé-api>" \
  -d '{
    "level": "info",
    "message": "Hello from my app!",
    "appId": "<ta-clé-api>",
    "pid": "12345",
    "hostname": "localhost",
    "ts": "2025-01-03T10:00:00.000Z"
  }' \
  localhost:30001 \
  logengine_grpc.Logger/addLog
```

**Réponse attendue** :
```json
{
  "code": "ok",
  "status": 200,
  "message": "log added"
}
```

### 4. Vérifier les logs en base de données

```bash
psql logengine -c "SELECT * FROM log;"
```

Tu devrais voir ton log !

---

## Tester le Rate Limiting

### HTTP (100 req/s par IP)

```bash
# Envoyer 200 requêtes rapidement
for i in {1..200}; do
  curl -s http://localhost:8080/api/health > /dev/null &
done
wait

# Les dernières requêtes devraient retourner 429 Too Many Requests
```

### gRPC (1000 logs/s par app)

Même principe avec `grpcurl` en boucle.

---

## Tester le Retry Logic

### 1. Arrêter RabbitMQ

```bash
brew services stop rabbitmq
```

### 2. Démarrer le serveur gRPC

```bash
make run_grpc_server
```

**Tu verras** :
```
Failed to connect to RabbitMQ (attempt 1): ...
Failed to connect to RabbitMQ (attempt 2): ...
...
```

### 3. Redémarrer RabbitMQ

```bash
brew services start rabbitmq
```

Le serveur devrait se connecter automatiquement !

---

## Tester le Graceful Shutdown

### 1. Démarrer un serveur

```bash
make run_grpc_server
```

### 2. Envoyer des logs

```bash
# Dans un autre terminal, envoyer des logs en continu
while true; do
  grpcurl -plaintext \
    -H "x-api-key: <ta-clé>" \
    -d '{"level":"info","message":"test","appId":"<ta-clé>","ts":"2025-01-03T10:00:00.000Z"}' \
    localhost:30001 logengine_grpc.Logger/addLog
  sleep 0.5
done
```

### 3. Arrêter le serveur

Appuie sur `Ctrl+C` dans le terminal du serveur.

**Tu verras** :
```
Received signal interrupt, initiating graceful shutdown...
Stopping gRPC server...
Waiting for consumer to finish processing messages...
Closing broker connections...
Shutdown complete
```

**Résultat** : Les logs en cours sont traités avant l'arrêt !

---

## Architecture du système

```
┌─────────────┐
│   Client    │ (grpcurl, SDK)
└──────┬──────┘
       │ gRPC (port 30001)
       ▼
┌──────────────────────┐
│  Serveur gRPC        │ (apps/engine)
│  - Authentification  │
│  - Rate limiting     │
│  - Validation        │
└──────┬───────────────┘
       │ Publish
       ▼
┌──────────────────────┐
│     RabbitMQ         │
│  Queue: log.new      │
└──────┬───────────────┘
       │ Consume
       ▼
┌──────────────────────┐
│  Consumer            │ (même process)
│  - Retry logic       │
│  - Backoff           │
└──────┬───────────────┘
       │ Insert
       ▼
┌──────────────────────┐
│   PostgreSQL         │
│  Table: log          │
└──────────────────────┘

┌─────────────┐
│ Admin UI    │ (React)
└──────┬──────┘
       │ HTTP (port 8080)
       ▼
┌──────────────────────┐
│  Serveur HTTP        │ (apps/server)
│  - Gestion users     │
│  - Gestion apps      │
│  - Consultation logs │
└──────────────────────┘
```

---

## Commandes utiles

```bash
# Formater le code
make fmt

# Vérifier le formatage
make fmt-check

# Linter
make lint

# Build
make build

# Nettoyer
make clean

# Aide
make help
```

---

## Troubleshooting

### Erreur : "can't connect to PostgreSQL"

```bash
# Vérifier que PostgreSQL tourne
brew services list | grep postgresql

# Vérifier la connexion
psql postgres -c "SELECT 1"
```

### Erreur : "can't connect to RabbitMQ"

```bash
# Vérifier que RabbitMQ tourne
brew services list | grep rabbitmq

# Interface web : http://localhost:15672
# Login: guest / guest
```

### Port déjà utilisé

```bash
# Trouver le process sur le port 8080
lsof -i :8080

# Tuer le process
kill -9 <PID>
```

---

## Prochaines étapes

1. **Frontend** : Démarrer l'interface admin React
2. **SDK Client** : Créer un SDK pour envoyer des logs facilement
3. **Metrics** : Implémenter le système de monitoring
4. **Tests** : Ajouter des tests unitaires et d'intégration

**Bon développement ! 🚀**
