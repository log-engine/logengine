# Guide de déploiement Docker - LogEngine

## Déploiement rapide (Production)

### Prérequis

- Docker 20.10+
- Docker Compose 1.29+

### Démarrage

```bash
# 1. Cloner le repo
git clone https://github.com/log-engine/logengine.git
cd logengine

# 2. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos paramètres de production

# 3. Démarrer tous les services
make docker-prod-up
```

Les services seront disponibles sur :
- HTTP API : `http://localhost:8080`
- gRPC : `localhost:30001`
- RabbitMQ UI : `http://localhost:15672`

## Configuration

### Variables d'environnement (.env)

```bash
# PostgreSQL
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=CHANGE_ME_IN_PRODUCTION
POSTGRES_PORT=5432

# RabbitMQ
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=CHANGE_ME_IN_PRODUCTION
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# Ports des serveurs
HTTP_PORT=8080
GRPC_PORT=30001

# Environment
ENV=production
```

**IMPORTANT:** Changez tous les mots de passe par défaut en production.

## Commandes Docker

### Production

```bash
# Construire les images
make docker-build

# Démarrer tous les services
make docker-prod-up

# Voir les logs
make docker-prod-logs

# Redémarrer les services
make docker-prod-restart

# Arrêter tous les services
make docker-prod-down
```

### Développement

```bash
# Démarrer seulement PostgreSQL + RabbitMQ
make docker-up

# Arrêter
make docker-down

# Logs
make docker-logs
```

## Architecture Docker

```
┌─────────────────────────────────────────┐
│        docker-compose.prod.yml          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  PostgreSQL │  │  RabbitMQ   │      │
│  │   :5432     │  │   :5672     │      │
│  └──────┬──────┘  └──────┬──────┘      │
│         │                 │             │
│  ┌──────┴─────────────────┴──────┐     │
│  │      gRPC Server              │     │
│  │      :30001                   │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │      HTTP Server              │     │
│  │      :8080                    │     │
│  └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

## Volumes Docker

Les données persistantes sont stockées dans des volumes Docker :

- `postgres_data` : Base de données PostgreSQL
- `rabbitmq_data` : Files d'attente RabbitMQ

### Backup des données

```bash
# Backup PostgreSQL
docker exec logengine-postgres pg_dump -U logengine logengine > backup.sql

# Restauration
cat backup.sql | docker exec -i logengine-postgres psql -U logengine logengine
```

## Santé des services

### Vérifier l'état

```bash
# Tous les services
docker-compose -f docker-compose.prod.yml ps

# Logs d'un service spécifique
docker logs logengine-grpc
docker logs logengine-http
docker logs logengine-postgres
docker logs logengine-rabbitmq
```

### Health checks

Tous les services ont des health checks automatiques :
- PostgreSQL : `pg_isready`
- RabbitMQ : `rabbitmq-diagnostics ping`
- Retry automatique toutes les 10s (max 5 tentatives)

## Production avancée

### Utiliser des images pré-construites

```bash
# Tag les images
docker tag logengine-grpc:latest your-registry/logengine-grpc:v1.0.0
docker tag logengine-http:latest your-registry/logengine-http:v1.0.0

# Push vers votre registry
docker push your-registry/logengine-grpc:v1.0.0
docker push your-registry/logengine-http:v1.0.0
```

Modifier `docker-compose.prod.yml` :
```yaml
grpc-server:
  image: your-registry/logengine-grpc:v1.0.0
  # Retirer la section 'build'
```

### Scaling

```bash
# Lancer 3 instances du serveur HTTP
docker-compose -f docker-compose.prod.yml up -d --scale http-server=3

# Lancer 2 instances du serveur gRPC
docker-compose -f docker-compose.prod.yml up -d --scale grpc-server=2
```

**Note:** Pour le scaling, utilisez un load balancer (nginx, traefik, etc.)

### Monitoring

Les containers exposent leur santé via Docker health checks.

Intégration avec des outils de monitoring :
- Prometheus (via Docker metrics)
- Grafana
- Portainer

### Logs

```bash
# Logs en temps réel
make docker-prod-logs

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f grpc-server

# Export des logs
docker-compose -f docker-compose.prod.yml logs --no-color > logs.txt
```

## Sécurité

### Recommandations production

1. **Changez tous les mots de passe** dans `.env`
2. **Limitez l'accès réseau** :
   ```yaml
   # Ne pas exposer PostgreSQL et RabbitMQ publiquement
   # Retirer les sections 'ports' si pas nécessaire
   ```
3. **Utilisez des secrets Docker** :
   ```bash
   echo "password" | docker secret create postgres_password -
   ```
4. **Activez TLS/SSL** pour gRPC et PostgreSQL
5. **Limitez les ressources** :
   ```yaml
   services:
     grpc-server:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

### Firewall

```bash
# Autoriser seulement les ports nécessaires
ufw allow 8080/tcp   # HTTP API
ufw allow 30001/tcp  # gRPC
# NE PAS exposer 5432 (PostgreSQL) et 5672 (RabbitMQ) publiquement
```

## Troubleshooting

### Les containers ne démarrent pas

```bash
# Vérifier les logs
make docker-prod-logs

# Vérifier l'état
docker-compose -f docker-compose.prod.yml ps
```

### Problème de connexion à PostgreSQL

```bash
# Vérifier que PostgreSQL est prêt
docker exec logengine-postgres pg_isready -U logengine

# Se connecter manuellement
docker exec -it logengine-postgres psql -U logengine
```

### Problème de connexion à RabbitMQ

```bash
# Vérifier l'état
docker exec logengine-rabbitmq rabbitmq-diagnostics ping

# Interface web
http://localhost:15672 (login avec RABBITMQ_USER/RABBITMQ_PASSWORD)
```

### Nettoyer et redémarrer

```bash
# Arrêter et supprimer les containers
make docker-prod-down

# Supprimer les volumes (ATTENTION: perte de données!)
docker-compose -f docker-compose.prod.yml down -v

# Reconstruire et redémarrer
make docker-build
make docker-prod-up
```

## Mise à jour

```bash
# 1. Pull la dernière version
git pull origin main

# 2. Reconstruire les images
make docker-build

# 3. Redémarrer les services
make docker-prod-restart
```

## Performance

### Optimisations

1. **Utiliser des images Alpine** (déjà fait)
2. **Multi-stage builds** (déjà fait)
3. **Limiter les ressources** :
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 1G
       reservations:
         cpus: '0.5'
         memory: 256M
   ```

### Monitoring des ressources

```bash
# Stats en temps réel
docker stats logengine-grpc logengine-http

# Utilisation CPU/Mémoire
docker-compose -f docker-compose.prod.yml top
```

## Support

Pour toute question sur le déploiement Docker :
- Créer une issue : https://github.com/log-engine/logengine/issues
- Documentation complète : [README.md](README.md)
