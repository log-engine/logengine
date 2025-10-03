# Politique de Sécurité

## Versions supportées

| Version | Supportée          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

## Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité dans LogEngine, merci de nous le signaler de manière responsable.

### Comment signaler

**NE PAS** créer d'issue publique GitHub pour les problèmes de sécurité.

Au lieu de cela :
1. Envoyez un email à : **security@logengine.io** (ou créez un Security Advisory privé sur GitHub)
2. Incluez une description détaillée de la vulnérabilité
3. Incluez les étapes pour reproduire le problème
4. Incluez la version affectée

### Réponse attendue

- Accusé de réception sous **48 heures**
- Première analyse sous **5 jours ouvrés**
- Correctif publié sous **30 jours** (selon la gravité)

### Programme de divulgation

Nous suivons une politique de divulgation coordonnée :
1. Le reporter signale la vulnérabilité (jour 0)
2. Nous analysons et confirmons (jour 1-5)
3. Nous développons un correctif (jour 5-30)
4. Nous publions le correctif (jour 30)
5. Divulgation publique après 90 jours maximum

## Bonnes pratiques de sécurité

### Pour les utilisateurs

- ✅ Utilisez toujours la dernière version
- ✅ Activez HTTPS/TLS pour les connexions gRPC en production
- ✅ Changez les mots de passe par défaut
- ✅ Limitez l'accès réseau (firewall)
- ✅ Activez l'authentification sur RabbitMQ et PostgreSQL
- ✅ Utilisez des secrets managers pour les credentials (Vault, AWS Secrets Manager)
- ✅ Activez les logs d'audit
- ✅ Configurez le rate limiting selon vos besoins

### Configuration sécurisée

**Fichier `.env` (JAMAIS versionné)** :
```bash
# PostgreSQL - Utilisez un mot de passe fort
DB_URI=postgres://user:STRONG_PASSWORD@localhost:5432/logengine?sslmode=require

# RabbitMQ - Changez les credentials par défaut
RABBITMQ_URI=amqp://admin:STRONG_PASSWORD@localhost:5672/

# Production
ENV=production
```

**PostgreSQL en production** :
```bash
# Forcer SSL
DB_URI=postgres://user:pass@host/db?sslmode=require&sslrootcert=/path/to/ca.crt
```

**gRPC avec TLS** :
```go
// Exemple : Activer TLS sur le serveur gRPC
creds, _ := credentials.NewServerTLSFromFile("cert.pem", "key.pem")
grpc.NewServer(grpc.Creds(creds))
```

## Dépendances

Nous utilisons :
- **Dependabot** : Mises à jour automatiques des dépendances
- **go mod** : Gestion des dépendances Go
- **GitHub Security Advisories** : Alertes de vulnérabilités

### Mises à jour des dépendances

```bash
# Mettre à jour toutes les dépendances
go get -u ./...
go mod tidy

# Vérifier les vulnérabilités
go list -m -u all
```

## Checklist de sécurité (Production)

- [ ] Variables d'environnement sécurisées (pas de hardcoded secrets)
- [ ] HTTPS/TLS activé sur tous les endpoints
- [ ] Rate limiting configuré
- [ ] Authentification forte (bcrypt pour les mots de passe)
- [ ] PostgreSQL avec SSL
- [ ] RabbitMQ avec credentials non-default
- [ ] Firewall configuré (limiter l'accès aux ports)
- [ ] Logs d'audit activés
- [ ] Backups réguliers de la base de données
- [ ] Monitoring actif (alertes sur anomalies)
- [ ] Mise à jour des dépendances régulière

## Vulnérabilités connues

Aucune vulnérabilité critique connue actuellement.

Consultez les [GitHub Security Advisories](https://github.com/log-engine/logengine/security/advisories) pour les mises à jour.

## Contact

Pour toute question sur la sécurité :
- Email : security@logengine.io
- GitHub Security Advisory : https://github.com/log-engine/logengine/security/advisories/new
