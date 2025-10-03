# LogEngine

**Système de collecte et gestion de logs centralisé, open-source, léger et performant.**

Alternative self-hosted à Sentry, Datadog ou Loggly pour surveiller vos applications en temps réel.

## Fonctionnalités

- **Collecte de logs** via gRPC (haute performance)
- **Authentification** par clé API
- **Rate limiting** (protection anti-spam)
- **Retry logic** avec backoff exponentiel
- **Stockage PostgreSQL** robuste
- **Queue RabbitMQ** pour traitement asynchrone
- **Graceful shutdown** (aucune perte de données)
- **Interface admin** React (à venir)

## Démarrage rapide (5 minutes)

### Prérequis

- Go 1.23+
- Docker (pour PostgreSQL + RabbitMQ)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/log-engine/logengine.git
cd logengine

# 2. Configuration automatique (installe les dépendances, démarre Docker)
make setup

# 3. Terminal 1 : Serveur gRPC
make run_grpc_server

# 4. Terminal 2 : Serveur HTTP
make run_http_server
```

 **C'est prêt !** Les serveurs tournent sur :
- HTTP API : `http://localhost:8080`
- gRPC : `localhost:30001`
- RabbitMQ UI : `http://localhost:15672` (guest/guest)

##  Documentation

- **[Guide de démarrage](QUICKSTART.md)** - Installation détaillée et premiers pas
- **[Guide de contribution](CONTRIBUTING.md)** - Standards de code et formatage
- **[Architecture](docs/ARCHITECTURE.md)** - Comment ça marche (à venir)

## Tester le système

```bash
# Tests automatisés complets
make test-system

# Tests unitaires
make test
```

##  Commandes principales

```bash
make help              # Affiche toutes les commandes disponibles
make setup             # Configuration initiale
make docker-up         # Démarre PostgreSQL + RabbitMQ
make build             # Compile les serveurs
make fmt               # Formate le code
make lint              # Analyse du code
```

## Utilisation basique

### 1. Créer une application

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{"name": "My App"}'

# Réponse : {"id": "...", "key": "xxx", "name": "My App"}
```

### 2. Envoyer un log

```bash
grpcurl -plaintext \
  -H "x-api-key: xxx" \
  -d '{
    "level": "info",
    "message": "Hello LogEngine!",
    "appId": "xxx",
    "ts": "2025-01-03T10:00:00.000Z"
  }' \
  localhost:30001 \
  logengine_grpc.Logger/addLog
```

### 3. Consulter les logs

```bash
psql logengine -c "SELECT * FROM log ORDER BY ts DESC LIMIT 10;"
```

##  Architecture

```
Client → gRPC Server → RabbitMQ → Consumer → PostgreSQL
              ↓
         Rate Limit
         Auth (API Key)
         Validation
```

- **Serveur gRPC** : Réception des logs (port 30001)
- **Serveur HTTP** : API REST pour admin (port 8080)
- **RabbitMQ** : Queue pour traitement asynchrone
- **PostgreSQL** : Stockage persistant

##  Production-Ready

**Retry logic** : Reconnexion automatique si RabbitMQ/PostgreSQL down
**Rate limiting** : 1000 logs/s par app, 100 req/s par IP
**Graceful shutdown** : Aucune perte de logs lors des redémarrages
**Validation** : Vérification stricte des données d'entrée
**Formatage** : Code standardisé avec gofmt + goimports

##  Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

```bash
# Setup développement
make setup
make install-tools

# Avant de commit
make fmt
make lint
make test
```

##  License

MIT

##  Credits

Développé avec ❤️ par la communauté LogEngine
