package main

import (
	"LedaaS/internal/config"
	"LedaaS/internal/db"
	"context"
	"log"

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

	// Try to get River to migrate by creating a client and starting/stopping it
	workers := river.NewWorkers()
	
	client, err := river.NewClient(riverpgxv5.New(pool), &river.Config{
		Workers: workers,
	})
	if err != nil {
		log.Fatalf("failed to create river client: %v", err)
	}

	// This should trigger migration
	if err := client.Start(ctx); err != nil {
		log.Printf("client start failed (expected): %v", err)
	}
	
	// Stop immediately
	client.Stop(ctx)
	
	log.Println("River migration attempt completed")
}
