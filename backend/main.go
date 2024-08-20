package main

import (
	"fmt"
	"tweet-generate/config"
	"tweet-generate/routes"

	"context"
	"log"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    app := fiber.New()
	app.Use(cors.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

    cfg := config.LoadConfig()
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

    opts:= options.Client().ApplyURI(cfg.MONGO_URI).SetServerAPIOptions(serverAPI)

	client, err:= mongo.Connect(context.TODO(), opts)
	if err!=nil{
		fmt.Println("error connecting to mongo", err)
		// panic(err)
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
		  panic(err)
		}
	  }()

	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	db := client.Database("tweetdb")

    routes.SetupRoutes(app, cfg, db)

	fmt.Println("Listening on port 3000...")
    log.Fatal(app.Listen(":3000"))
}
