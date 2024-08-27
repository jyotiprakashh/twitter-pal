package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct{
	MONGO_URI string
	JWTSecret string
	IPINFO_TOKEN string
	TWITTER_BEARER_TOKEN string
	GEMINI_KEY string

	// APIKey string
	// APISecret string
	// AccessToken string
	// AccessSecret string

	Serpapi_key string
	RapidAPIKey string
}

func LoadConfig() *Config{
	err:= godotenv.Load()
	if err != nil {
		panic(err)
	}
	return &Config{
		MONGO_URI: os.Getenv("MONGO_URI"),
		JWTSecret: os.Getenv("JWT_SECRET"),
		IPINFO_TOKEN: os.Getenv("IPINFO_TOKEN"),
		TWITTER_BEARER_TOKEN: os.Getenv("TWITTER_BEARER_TOKEN"),
		// APIKey: os.Getenv("TWITTER_API_KEY"),
		// APISecret: os.Getenv("TWITTER_API_SECRET"),
		// AccessToken: os.Getenv("TWITTER_ACCESS_TOKEN"),
		// AccessSecret: os.Getenv("TWITTER_ACCESS_TOKEN_SECRET"),
		RapidAPIKey: os.Getenv("X_RAPDAPI_KEY"),
		Serpapi_key: os.Getenv("SERPAPI_SECRET_KEY"),
		GEMINI_KEY: os.Getenv("GEMINI_API_KEY"),
	}
}