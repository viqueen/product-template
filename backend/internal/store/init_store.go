package store

import (
	"fmt"

	"github.com/viqueen/product-template/backend/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitStore(cfg *config.Config) (*gorm.DB, error) {
	connectionString := cfg.Database.ConnectionString()

	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Auto-migrate the schema
	err = db.AutoMigrate(&Todo{})
	if err != nil {
		return nil, fmt.Errorf("failed to auto-migrate database schema: %w", err)
	}

	return db, nil
}
