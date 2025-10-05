# Déploiement Dokploy - Services séparés

Ce dossier contient les fichiers Docker Compose pour déployer chaque service LogEngine séparément sur Dokploy.

## Structure

```
dokploy/
├── postgres.docker-compose.yml        # Base de données PostgreSQL
├── rabbitmq.docker-compose.yml        # Message broker RabbitMQ
├── grpc-server.docker-compose.yml     # Serveur gRPC
├── http-server.docker-compose.yml     # Serveur HTTP/API
└── README.md                          # Ce fichier
```

## Ordre de déploiement

Il est important de déployer les services dans cet ordre :

1. **PostgreSQL** (postgres.docker-compose.yml)
2. **RabbitMQ** (rabbitmq.docker-compose.yml)
3. **gRPC Server** (grpc-server.docker-compose.yml)
4. **HTTP Server** (http-server.docker-compose.yml)

## Configuration dans Dokploy

### 1. PostgreSQL

**Créer un nouveau service "Compose"**
- Nom : `logengine-postgres`
- Repository : `https://github.com/log-engine/logengine`
- Branch : `main`
- Compose Path : `./dokploy/postgres.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=votre_mot_de_passe_securise
```

### 2. RabbitMQ

**Créer un nouveau service "Compose"**
- Nom : `logengine-rabbitmq`
- Repository : `https://github.com/log-engine/logengine`
- Branch : `main`
- Compose Path : `./dokploy/rabbitmq.docker-compose.yml`

**Variables d'environnement :**
```env
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=votre_mot_de_passe_securise
RABBITMQ_DOMAIN=rabbitmq.votredomaine.com
```

### 3. gRPC Server

**Créer un nouveau service "Compose"**
- Nom : `logengine-grpc`
- Repository : `https://github.com/log-engine/logengine`
- Branch : `main`
- Compose Path : `./dokploy/grpc-server.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=votre_mot_de_passe_securise
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=votre_mot_de_passe_securise
GRPC_DOMAIN=grpc.votredomaine.com
```

### 4. HTTP Server

**Créer un nouveau service "Compose"**
- Nom : `logengine-http`
- Repository : `https://github.com/log-engine/logengine`
- Branch : `main`
- Compose Path : `./dokploy/http-server.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=votre_mot_de_passe_securise
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=votre_mot_de_passe_securise
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre_mot_de_passe_admin
HTTP_DOMAIN=api.votredomaine.com
```

## Réseau partagé

Tous les services utilisent le réseau **logengine.io-network** qui est créé automatiquement par Dokploy. Cela permet aux services de communiquer entre eux :

- Le gRPC server peut accéder à PostgreSQL via `postgres:5432`
- Le gRPC server peut accéder à RabbitMQ via `rabbitmq:5672`
- Le HTTP server peut accéder à PostgreSQL via `postgres:5432`
- Le HTTP server peut accéder à RabbitMQ via `rabbitmq:5672`

## Configuration DNS

Configurez vos enregistrements DNS pour pointer vers votre serveur Dokploy :

```
A    api.votredomaine.com        -> IP_DE_VOTRE_SERVEUR
A    grpc.votredomaine.com       -> IP_DE_VOTRE_SERVEUR
A    rabbitmq.votredomaine.com   -> IP_DE_VOTRE_SERVEUR
```

## Accès aux services

Après le déploiement :

- **HTTP API** : `https://api.votredomaine.com`
- **gRPC** : `https://grpc.votredomaine.com:443`
- **RabbitMQ UI** : `https://rabbitmq.votredomaine.com`
- **PostgreSQL** : Accessible seulement depuis le réseau interne (pas exposé publiquement)

## Avantages de cette architecture

### Déploiement indépendant
- Redéployer un service sans affecter les autres
- Mettre à jour uniquement le code HTTP sans rebuild du gRPC

### Scaling flexible
- Scaler uniquement les services qui en ont besoin
- Exemple : 3 instances HTTP, 1 instance gRPC

### Monitoring séparé
- Logs isolés par service
- Métriques individuelles
- Debugging plus simple

### Rollback facile
- Revenir à une version précédente d'un service spécifique
- Pas d'impact sur les autres services

## Gestion des mises à jour

### Mise à jour d'un seul service

1. Dans Dokploy, sélectionnez le service à mettre à jour
2. Cliquez sur "Redeploy"
3. Seul ce service sera rebuild et redémarré

### Mise à jour de tous les services

Redéployez dans l'ordre :
1. PostgreSQL (si changement de schéma)
2. RabbitMQ (si changement de configuration)
3. gRPC Server
4. HTTP Server

## Troubleshooting

### Les services ne peuvent pas communiquer

Vérifiez que tous les services sont sur le réseau `logengine.io-network` :

```bash
docker network inspect logengine.io-network
```

### PostgreSQL non accessible

```bash
# Vérifier que PostgreSQL est démarré
docker ps | grep postgres

# Tester la connexion depuis le réseau
docker run --rm --network logengine.io-network postgres:15-alpine \
  pg_isready -h postgres -p 5432 -U logengine
```

### RabbitMQ non accessible

```bash
# Vérifier l'état de RabbitMQ
docker ps | grep rabbitmq

# Tester depuis le réseau
docker run --rm --network logengine.io-network curlimages/curl:latest \
  curl -u admin:password http://rabbitmq:15672/api/overview
```

## Monitoring

Dans l'interface Dokploy, chaque service a :
- Ses propres logs
- Ses propres métriques (CPU, RAM, réseau)
- Son propre statut de santé

## Sécurité

- PostgreSQL et RabbitMQ ne sont PAS exposés publiquement
- Seuls HTTP API, gRPC et RabbitMQ UI sont accessibles via HTTPS
- Communication interne via le réseau Docker privé
- Certificats SSL/TLS automatiques via Let's Encrypt

## Support

Pour plus de détails, consultez [DOKPLOY.md](../DOKPLOY.md) dans le dossier racine.
