package routes

import(
	"tweet-generate/config"
	"tweet-generate/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRoutes( app *fiber.App, cfg *config.Config, db *mongo.Database ) {
	api:= app.Group("/api")

	auth := api.Group("/auth")
    auth.Post("/signup", func(c *fiber.Ctx) error { return controllers.SignUp(c, db) })
    auth.Post("/login", func(c *fiber.Ctx) error { return controllers.Login(c, db, cfg.JWTSecret) })

	// api.Use(func(c *fiber.Ctx) error {
    //     return controllers.Protected(c, cfg.JWTSecret)
    // })


	tweet := api.Group("/tweets")
    tweet.Post("/", func(c *fiber.Ctx) error { return controllers.CreateTweet(c, db, cfg.GEMINI_KEY) })
    tweet.Get("/", func(c *fiber.Ctx) error { return controllers.GetTweets(c, db) })
    tweet.Put("/:id", func(c *fiber.Ctx) error { return controllers.UpdateTweet(c, db) })
    tweet.Delete("/:id", func(c *fiber.Ctx) error { return controllers.DeleteTweet(c, db) })

	trend := api.Group("/trends")
    trend.Get("/", func(c *fiber.Ctx) error { return controllers.GetTrends(c, cfg.IPINFO_TOKEN, cfg.Serpapi_key, cfg.RapidAPIKey) })
}