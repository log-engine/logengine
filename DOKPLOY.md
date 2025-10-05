# Guide de déploiement Dokploy - LogEngine

## Qu'est-ce que Dokploy ?

Dokploy est une plateforme de déploiement open-source qui simplifie le déploiement d'applications Docker avec gestion automatique de SSL/TLS via Traefik.

## Prérequis

- Un serveur avec Dokploy installé
- Un nom de domaine configuré
- Accès SSH au serveur (optionnel)

## Architecture recommandée : Services séparés

Pour LogEngine, nous recommandons de déployer chaque service séparément dans Dokploy. Cela offre :

- **Déploiement indépendant** : Redéployer un service sans affecter les autres
- **Scaling flexible** : Scaler uniquement les services nécessaires
- **Logs isolés** : Debugging plus simple avec logs séparés
- **Rollback facile** : Revenir en arrière service par service

### Services à déployer

1. **PostgreSQL** - Base de données
2. **RabbitMQ** - Message broker
3. **gRPC Server** - Serveur de collecte de logs
4. **HTTP Server** - API REST et interface admin

Tous les services communiquent via le réseau `dokploy-network ` créé automatiquement par Dokploy.

## Guide de déploiement détaillé

### Étape 1 : Préparer votre serveur Dokploy

1. Installez Dokploy sur votre serveur
2. Configurez vos DNS pour pointer vers votre serveur
3. Créez un nouveau projet "LogEngine"

### Étape 2 : Configurer DNS

Ajoutez ces enregistrements DNS :

```
A    api.votredomaine.com        -> IP_DE_VOTRE_SERVEUR
A    grpc.votredomaine.com       -> IP_DE_VOTRE_SERVEUR
A    rabbitmq.votredomaine.com   -> IP_DE_VOTRE_SERVEUR
```

### Étape 3 : Déployer PostgreSQL

**Dans Dokploy :**
1. Créer un nouveau service → Docker Compose
2. Nom : `logengine-postgres`
3. Repository : `https://github.com/log-engine/logengine`
4. Branch : `main`
5. Compose Path : `./dokploy/postgres.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=CHANGEZ_MOI_MOT_DE_PASSE_SECURISE
```

6. Cliquez sur "Deploy"
7. Attendez que le service soit "Running"

### Étape 4 : Déployer RabbitMQ

**Dans Dokploy :**
1. Créer un nouveau service → Docker Compose
2. Nom : `logengine-rabbitmq`
3. Repository : `https://github.com/log-engine/logengine`
4. Branch : `main`
5. Compose Path : `./dokploy/rabbitmq.docker-compose.yml`

**Variables d'environnement :**
```env
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=CHANGEZ_MOI_MOT_DE_PASSE_SECURISE
RABBITMQ_DOMAIN=rabbitmq.votredomaine.com
```

6. Cliquez sur "Deploy"
7. Attendez que le service soit "Running"

### Étape 5 : Déployer gRPC Server

**Dans Dokploy :**
1. Créer un nouveau service → Docker Compose
2. Nom : `logengine-grpc`
3. Repository : `https://github.com/log-engine/logengine`
4. Branch : `main`
5. Compose Path : `./dokploy/grpc-server.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=MEME_MOT_DE_PASSE_QUE_POSTGRES
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=MEME_MOT_DE_PASSE_QUE_RABBITMQ
GRPC_DOMAIN=grpc.votredomaine.com
```

6. Cliquez sur "Deploy"
7. Le build peut prendre 3-5 minutes
8. Vérifiez les logs pour confirmer le démarrage

### Étape 6 : Déployer HTTP Server

**Dans Dokploy :**
1. Créer un nouveau service → Docker Compose
2. Nom : `logengine-http`
3. Repository : `https://github.com/log-engine/logengine`
4. Branch : `main`
5. Compose Path : `./dokploy/http-server.docker-compose.yml`

**Variables d'environnement :**
```env
POSTGRES_DB=logengine
POSTGRES_USER=logengine
POSTGRES_PASSWORD=MEME_MOT_DE_PASSE_QUE_POSTGRES
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=MEME_MOT_DE_PASSE_QUE_RABBITMQ
ADMIN_USERNAME=admin
ADMIN_PASSWORD=CHANGEZ_MOI_MOT_DE_PASSE_ADMIN
HTTP_DOMAIN=api.votredomaine.com
```

6. Cliquez sur "Deploy"
7. Attendez que le build se termine

### Étape 7 : Vérifier le déploiement

Testez vos services :

```bash
# Test HTTP API
curl https://api.votredomaine.com/api/health

# Test RabbitMQ UI
# Ouvrir dans le navigateur : https://rabbitmq.votredomaine.com
```

## Architecture déployée

```
                    Internet
                       |
                   [Traefik]
                       |
        ┌──────────────┼──────────────┐
        |              |              |
  [HTTP API]      [gRPC Server]  [RabbitMQ UI]
  :8080           :30001         :15672
        |              |              |
        └──────────────┼──────────────┘
                       |
            ┌──────────┴──────────┐
            |                     |
       [PostgreSQL]          [RabbitMQ]
         :5432                :5672

    Tous sur le réseau: dokploy-network
```

## Accès aux services

- **HTTP API** : `https://api.votredomaine.com`
- **gRPC** : `https://grpc.votredomaine.com:443`
- **RabbitMQ UI** : `https://rabbitmq.votredomaine.com`
- **PostgreSQL** : Interne seulement (non exposé)

## Gestion des services

### Logs

Dans Dokploy, sélectionnez un service → Onglet "Logs"

```bash
# Ou via SSH
docker logs -f <container-name>
```

### Redéployer un service

1. Sélectionner le service dans Dokploy
2. Cliquer sur "Redeploy"
3. Seul ce service sera reconstruit

### Scaling

Pour scaler le HTTP server (3 instances) :

1. Modifier le fichier `dokploy/http-server.docker-compose.yml`
2. Ajouter :
```yaml
services:
  http-server:
    deploy:
      replicas: 3
```
3. Redéployer

### Monitoring

Dokploy fournit automatiquement :
- CPU usage par service
- Memory usage par service
- Network traffic
- Statut de santé (healthchecks)

## Backup et restauration

### Backup PostgreSQL

```bash
# Se connecter au serveur
ssh votre-serveur

# Trouver le container PostgreSQL
docker ps | grep postgres

# Créer un backup
docker exec <postgres-container> pg_dump -U logengine logengine > backup-$(date +%Y%m%d).sql

# Télécharger le backup
scp votre-serveur:backup-*.sql ./
```

### Restaurer PostgreSQL

```bash
# Uploader le backup
scp backup.sql votre-serveur:~/

# Restaurer
cat backup.sql | docker exec -i <postgres-container> psql -U logengine logengine
```

### Backup RabbitMQ

Les volumes sont automatiquement persistés par Dokploy dans `/var/lib/dokploy/volumes/`.

## Mises à jour

### Mise à jour d'un seul service

1. Push votre code vers GitHub
2. Dans Dokploy → Sélectionner le service
3. Cliquer sur "Redeploy"

### Mise à jour de tous les services

Redéployez dans l'ordre :
1. PostgreSQL (si migration de schéma)
2. RabbitMQ (si changement de config)
3. gRPC Server
4. HTTP Server

## Sécurité

### Recommandations

1. **Changez TOUS les mots de passe par défaut**
2. **Utilisez des secrets Dokploy** au lieu de variables d'environnement
3. **Limitez l'accès RabbitMQ UI** avec authentification Traefik

### Ajouter l'authentification Traefik

Pour protéger RabbitMQ UI :

```yaml
labels:
  - "traefik.http.middlewares.rabbitmq-auth.basicauth.users=admin:$$apr1$$..."
  - "traefik.http.routers.logengine-rabbitmq.middlewares=rabbitmq-auth"
```

Générer le hash :
```bash
htpasswd -nb admin password
```

### Firewall

Dokploy gère le firewall automatiquement. Ports ouverts :
- 80 (HTTP → HTTPS redirect)
- 443 (HTTPS)
- 22 (SSH)

## Troubleshooting

### Les services ne communiquent pas

Vérifiez que tous sont sur `dokploy-network ` :

```bash
docker network inspect dokploy-network
```

### PostgreSQL non accessible

```bash
# Vérifier le statut
docker ps | grep postgres

# Tester la connexion depuis le réseau
docker run --rm --network dokploy-network  postgres:15-alpine \
  pg_isready -h postgres -p 5432 -U logengine
```

### RabbitMQ non accessible

```bash
# Vérifier le statut
docker exec <rabbitmq-container> rabbitmq-diagnostics status
```

### Erreur de build

1. Vérifiez les logs de build dans Dokploy
2. Vérifiez que les Dockerfiles existent
3. Vérifiez que le Compose Path est correct

### Certificat SSL non généré

1. Vérifiez que vos DNS pointent vers le serveur
2. Attendez 5-10 minutes pour la propagation
3. Vérifiez les logs Traefik

## Performance

### Ressources recommandées

**Minimum :**
- 2 CPU cores
- 4 GB RAM
- 20 GB SSD

**Production :**
- 4 CPU cores
- 8 GB RAM
- 50 GB SSD

### Optimisations

Limitez les ressources par service :

```yaml
services:
  http-server:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Coût estimé

- **VPS Hetzner CPX21** : 5,83€/mois (2 vCPU, 4 GB RAM)
- **Nom de domaine** : ~12€/an
- **Dokploy** : Gratuit (open-source)
- **SSL Let's Encrypt** : Gratuit

**Total : ~6€/mois**

## Alternative : Déploiement monolithique

Si vous préférez déployer tous les services ensemble :

**Compose Path :** `./docker-compose.dokploy.yml`

Voir le fichier pour la configuration complète.

## Support et ressources

- **Documentation complète** : [dokploy/README.md](dokploy/README.md)
- **Documentation Dokploy** : https://docs.dokploy.com
- **Issues LogEngine** : https://github.com/log-engine/logengine/issues
- **Discord Dokploy** : https://discord.gg/dokploy

## Prochaines étapes

Après le déploiement :

1. Tester l'API avec curl
2. Envoyer des logs de test
3. Configurer vos applications pour envoyer des logs
4. Monitorer les performances
5. Configurer les alertes (optionnel)

Pour plus de détails sur l'utilisation, consultez [QUICKSTART.md](QUICKSTART.md).
