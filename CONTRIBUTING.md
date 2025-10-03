# Guide de contribution - LogEngine

## Configuration du formatage

### Installation des outils

```bash
make install-tools
```

Cela installe :
- `goimports` : Formateur et organisateur d'imports
- `golangci-lint` : Linter complet

### Formatage du code

#### Automatique (recommandé)

Le code est automatiquement formaté à chaque commit Git grâce au hook `pre-commit`.

#### Manuel

```bash
# Formater tout le code
make fmt

# Vérifier le formatage (CI/CD)
make fmt-check

# Linter le code
make lint
```

### Configuration IDE

#### VS Code

La configuration est dans `.vscode/settings.json` :
- Format automatique à la sauvegarde
- Organisation automatique des imports
- Utilise `gofmt` par défaut

Extensions recommandées :
- `golang.go` : Support Go officiel
- `esbenp.prettier-vscode` : Pour le frontend

#### GoLand / IntelliJ IDEA

1. Settings → Tools → File Watchers
2. Ajouter un watcher pour `goimports`
3. Activer "Format on save"

### Standards de formatage

#### Go

- **Indentation** : Tabs (4 espaces affichés)
- **Imports** : Groupés en 3 sections
  1. Bibliothèque standard
  2. Packages locaux (`logengine/...`)
  3. Packages tiers
- **Ligne max** : 120 caractères (recommandé)

Exemple :
```go
package mypackage

import (
    "context"
    "fmt"
    "time"

    "logengine/libs/retry"
    "logengine/apps/engine/broker"

    "github.com/gin-gonic/gin"
)
```

#### JavaScript/TypeScript (frontend)

- **Indentation** : 2 espaces
- **Formateur** : Prettier
- **Quotes** : Single quotes
- **Semicolons** : Oui

### Git Hooks

#### Pre-commit

Formatage automatique des fichiers Go modifiés :
- `gofmt` : Formatage de base
- `goimports` : Organisation des imports

Le hook est dans `.git/hooks/pre-commit`.

### Commandes utiles

```bash
# Afficher l'aide
make help

# Build les deux serveurs
make build

# Lancer les tests
make test

# Nettoyer les binaires
make clean

# Générer les fichiers protobuf
make generate_proto
```

## Style de code

### Nommage

- **Variables** : camelCase (`userId`, `logCount`)
- **Constantes** : UPPER_SNAKE_CASE (`LOG_QUEUE`, `MAX_RETRIES`)
- **Fonctions exportées** : PascalCase (`NewBroker`, `GetMetrics`)
- **Fonctions privées** : camelCase (`initChannel`, `cleanup`)

### Commentaires

- Toutes les fonctions exportées doivent avoir un commentaire
- Format : `// FunctionName description...`

```go
// NewRateLimiter crée un nouveau rate limiter
// rate: nombre de requêtes autorisées par interval
// interval: période de temps (ex: 1 seconde)
func NewRateLimiter(rate int, interval time.Duration) *RateLimiter {
    // ...
}
```

### Gestion d'erreurs

- Toujours vérifier les erreurs
- Messages d'erreur en minuscules, sans ponctuation
- Wrapping avec contexte : `fmt.Errorf("failed to connect: %w", err)`

```go
if err != nil {
    return fmt.Errorf("failed to publish message: %w", err)
}
```

## CI/CD

Le formatage est vérifié dans la CI avec `make fmt-check`.

Si le build échoue :
```bash
make fmt
git add .
git commit --amend --no-edit
git push --force-with-lease
```
