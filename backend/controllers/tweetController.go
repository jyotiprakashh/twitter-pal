package controllers

import (
	// "context"
	// "strings"
	"fmt"
	"os"
	"strings"
	"time"
	"tweet-generate/models"
	"tweet-generate/services"

	"tweet-generate/utils"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTweet(c *fiber.Ctx, db *mongo.Database, GEMINI_KEY string) error {
	var tweet models.Tweet
	token:= c.Get("Token")
	fmt.Println(token)
	secret:= os.Getenv("JWT_SECRET")
	fmt.Println(secret)
	userID, err := utils.ValidateJWT(token, secret)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}
    
	if err := c.BodyParser(&tweet); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
    println(tweet.Topic, tweet.Tone)
	for i := range tweet.Keywords {
		tweet.Keywords[i] = strings.ToLower(tweet.Keywords[i])
		fmt.Println(tweet.Keywords[i])
	}
	// userid := c.Locals("user_id").(string)
	tweet.UserID = userID
	tweet.CreatedAt = time.Now().Unix()
	tweet.ID = primitive.NewObjectID()

	
	content, err := services.GenerateTweet(tweet.Topic, tweet.Keywords, tweet.Tone, GEMINI_KEY, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	tweet.Content = content
	
	if err := services.CreateTweet(tweet, db); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	
	fmt.Println("tweet id: ", tweet.ID)
	return c.Status(fiber.StatusCreated).JSON(tweet)
}

func GetTweets(c *fiber.Ctx, db *mongo.Database) error {
	token:= c.Get("Token")
	fmt.Println(token)
	secret:= os.Getenv("JWT_SECRET")
	fmt.Println(secret)
	userID, err := utils.ValidateJWT(token, secret)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}
	fmt.Println(userID)
	// c.Locals("user_id", userID)

	// userID, ok := c.Locals("user_id").(string)
	// if !ok || userID == "" {
	// 	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	// }

	tweets, err := services.GetTweets(userID, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	for i := range tweets {
		tweets[i].Content = strings.TrimSpace(tweets[i].Content)
		fmt.Println(tweets[i].Content)
	}

	return c.JSON(tweets)
}

func UpdateTweet(c *fiber.Ctx, db *mongo.Database) error {
	tweetID := c.Params("id")
	var data struct {
		Content string `json:"content"`
	}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := services.UpdateTweet(tweetID, data.Content, db); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func DeleteTweet(c *fiber.Ctx, db *mongo.Database) error {
	fmt.Println("tweet id: ", c.Params("id"))
	tweetID := c.Params("id")

	if err := services.DeleteTweet(tweetID, db); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
