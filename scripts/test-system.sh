#!/bin/bash

# Script de test automatisé pour LogEngine
# Ce script teste les fonctionnalités principales du système

set -e

echo "Tests LogEngine"
echo "=================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
HTTP_URL="http://localhost:8080"
GRPC_URL="localhost:30001"
TOKEN=""
APP_KEY=""

# Fonctions utilitaires
success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

error() {
    echo -e "${RED}[ERREUR]${NC} $1"
    exit 1
}

info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Vérifier que les serveurs tournent
check_servers() {
    info "Vérification des serveurs..."

    # HTTP Server
    if curl -s -f "${HTTP_URL}/api/health" > /dev/null 2>&1; then
        success "Serveur HTTP (port 8080) : OK"
    else
        error "Serveur HTTP ne répond pas. Démarre-le avec : make run_http_server"
    fi

    # gRPC Server (via grpcurl)
    if command -v grpcurl &> /dev/null; then
        if grpcurl -plaintext ${GRPC_URL} list > /dev/null 2>&1; then
            success "Serveur gRPC (port 30001) : OK"
        else
            error "Serveur gRPC ne répond pas. Démarre-le avec : make run_grpc_server"
        fi
    else
        info "grpcurl n'est pas installé, skip du test gRPC"
        info "Installation: brew install grpcurl"
    fi

    echo ""
}

# Test 1 : Créer un utilisateur
test_create_user() {
    info "Test 1: Création d'un utilisateur..."

    RESPONSE=$(curl -s -X POST "${HTTP_URL}/api/users" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "test_user_'$(date +%s)'",
            "password": "test123456",
            "role": "admin",
            "apps": []
        }')

    if echo "$RESPONSE" | grep -q "id"; then
        success "Utilisateur créé"
    else
        error "Échec création utilisateur: $RESPONSE"
    fi

    echo ""
}

# Test 2 : Login
test_login() {
    info "Test 2: Login utilisateur..."

    # Créer un user pour le test
    curl -s -X POST "${HTTP_URL}/api/users" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "login_test",
            "password": "password123",
            "role": "admin",
            "apps": []
        }' > /dev/null

    RESPONSE=$(curl -s -X POST "${HTTP_URL}/api/users/login" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "login_test",
            "password": "password123"
        }')

    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

    if [ -n "$TOKEN" ]; then
        success "Login réussi (token: ${TOKEN:0:20}...)"
    else
        error "Échec login: $RESPONSE"
    fi

    echo ""
}

# Test 3 : Créer une application
test_create_app() {
    info "Test 3: Création d'une application..."

    if [ -z "$TOKEN" ]; then
        info "Pas de token, skip du test"
        return
    fi

    RESPONSE=$(curl -s -X POST "${HTTP_URL}/api/applications" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${TOKEN}" \
        -d '{
            "name": "Test App '$(date +%s)'"
        }')

    APP_KEY=$(echo "$RESPONSE" | grep -o '"key":"[^"]*' | cut -d'"' -f4)

    if [ -n "$APP_KEY" ]; then
        success "Application créée (key: ${APP_KEY:0:20}...)"
    else
        error "Échec création app: $RESPONSE"
    fi

    echo ""
}

# Test 4 : Envoyer un log via gRPC
test_send_log() {
    info "Test 4: Envoi d'un log via gRPC..."

    if ! command -v grpcurl &> /dev/null; then
        info "grpcurl non installé, skip du test"
        return
    fi

    if [ -z "$APP_KEY" ]; then
        info "Pas d'app key, skip du test"
        return
    fi

    RESPONSE=$(grpcurl -plaintext \
        -H "x-api-key: ${APP_KEY}" \
        -d '{
            "level": "info",
            "message": "Test log from automated test",
            "appId": "'${APP_KEY}'",
            "pid": "12345",
            "hostname": "test-host",
            "ts": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
        }' \
        ${GRPC_URL} \
        logengine_grpc.Logger/addLog 2>&1)

    if echo "$RESPONSE" | grep -q '"code": "ok"'; then
        success "Log envoyé avec succès"
    else
        error "Échec envoi log: $RESPONSE"
    fi

    echo ""
}

# Test 5 : Rate limiting
test_rate_limit() {
    info "Test 5: Rate limiting HTTP..."

    # Envoyer 110 requêtes (limite = 100/s)
    COUNT=0
    for i in {1..110}; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HTTP_URL}/api/health")
        if [ "$STATUS" = "429" ]; then
            COUNT=$((COUNT + 1))
        fi
    done

    if [ $COUNT -gt 0 ]; then
        success "Rate limiting fonctionne ($COUNT requêtes bloquées)"
    else
        info "Rate limiting non testé (peut nécessiter plus de requêtes)"
    fi

    echo ""
}

# Test 6 : Vérifier les logs en base
test_check_db() {
    info "Test 6: Vérification des logs en base..."

    if command -v psql &> /dev/null; then
        COUNT=$(psql ${DB_URI:-logengine} -t -c "SELECT COUNT(*) FROM log" 2>/dev/null | tr -d ' ')
        if [ -n "$COUNT" ]; then
            success "$COUNT logs en base de données"
        else
            info "Impossible de se connecter à PostgreSQL"
        fi
    else
        info "psql non installé, skip du test"
    fi

    echo ""
}

# Exécution des tests
main() {
    check_servers
    test_create_user
    test_login
    test_create_app
    test_send_log
    test_rate_limit
    test_check_db

    echo ""
    echo -e "${GREEN}=================="
    echo "Tests terminés !"
    echo -e "==================${NC}"
}

main
