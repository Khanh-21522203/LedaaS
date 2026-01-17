package main

import (
	"LedaaS/internal/auth"
	"LedaaS/internal/config"
	"LedaaS/internal/db"
	"LedaaS/internal/ledger"
	"LedaaS/internal/webhook"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/riverqueue/river"
	"github.com/riverqueue/river/riverdriver/riverpgxv5"
)

func main() {
	ctx := context.Background()

	cfg := config.Load()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	workers := river.NewWorkers()
	river.AddWorker(workers, &webhook.Worker{DB: pool})

	riverClient, err := river.NewClient(riverpgxv5.New(pool), &river.Config{
		Workers: workers,
	})
	if err != nil {
		log.Fatalf("failed to create river client: %v", err)
	}

	// Create ledger service with River client
	ledgerService := &ledger.Service{
		DB:          pool,
		RiverClient: riverClient,
	}

	ledgerHandler := &ledger.Handler{
		Service: ledgerService,
	}

	// Setup auth middleware
	authMiddleware := &auth.Middleware{
		DB:           pool,
		APIKeySecret: cfg.APIKeySecret,
	}

	mux := http.NewServeMux()

	// Routes
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	mux.Handle("/v1/transactions", authMiddleware.AuthMiddleware(
		http.HandlerFunc(ledgerHandler.PostTransaction),
	))

	// TODO: Add more routes

	server := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: mux,
	}

	go func() {
		log.Printf("Server starting on port %s", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	log.Println("Shutting down server...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("server shutdown error: %v", err)
	}

	log.Println("Server stopped")
}
