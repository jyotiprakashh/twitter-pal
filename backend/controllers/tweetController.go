package controllers

import (
	// "context"
	// "strings"
	"fmt"
	"strings"
	"time"
	"tweet-generate/models"
	"tweet-generate/services"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTweet(c *fiber.Ctx, db *mongo.Database, GEMINI_KEY string) error {
	var tweet models.Tweet
	// tweet.Keywords = strings.Split(c.Query("keywords"), ",")
	// tweet.Tone = c.Query("tone")
	// tweet.Topic="testis"
	// tweet.Keywords = []string{"test"}
	// tweet.Tone = "test"
    
	if err := c.BodyParser(&tweet); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
    println(tweet.Topic, tweet.Tone)
	for i := range tweet.Keywords {
		tweet.Keywords[i] = strings.ToLower(tweet.Keywords[i])
		fmt.Println(tweet.Keywords[i])
	}

	tweet.UserID = primitive.NewObjectID()
	tweet.CreatedAt = time.Now().Unix()

	content, err := services.GenerateTweet(tweet.Topic, tweet.Keywords, tweet.Tone, GEMINI_KEY, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	tweet.Content = content

	if err := services.CreateTweet(tweet, db); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(tweet)
}

func GetTweets(c *fiber.Ctx, db *mongo.Database) error {
	userID := c.Locals("user_id").(string)

	tweets, err := services.GetTweets(userID, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
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
	tweetID := c.Params("id")

	if err := services.DeleteTweet(tweetID, db); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
