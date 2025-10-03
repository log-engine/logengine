package logger

import (
	"context"
	"database/sql"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type AuthInterceptor struct {
	db *sql.DB
}

func NewAuthInterceptor(db *sql.DB) *AuthInterceptor {
	return &AuthInterceptor{db: db}
}

// UnaryInterceptor vérifie l'authentification pour les appels gRPC unaires
func (a *AuthInterceptor) UnaryInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	// Récupérer les metadata du contexte
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Error(codes.Unauthenticated, "metadata not provided")
	}

	// Récupérer l'API key depuis les metadata
	apiKeys := md.Get("x-api-key")
	if len(apiKeys) == 0 {
		return nil, status.Error(codes.Unauthenticated, "x-api-key not provided")
	}

	apiKey := apiKeys[0]
	if apiKey == "" {
		return nil, status.Error(codes.Unauthenticated, "x-api-key is empty")
	}

	// Vérifier que la clé API existe en base de données
	query := `select id from app where key = $1`
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var appId string
	err := a.db.QueryRowContext(ctx, query, apiKey).Scan(&appId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Error(codes.Unauthenticated, "invalid api key")
		}
		log.Printf("error checking api key: %v", err)
		return nil, status.Error(codes.Internal, "authentication failed")
	}

	// Ajouter l'appId au contexte pour l'utiliser dans les handlers
	ctx = context.WithValue(ctx, "appId", appId)

	// Continuer avec le handler
	return handler(ctx, req)
}
