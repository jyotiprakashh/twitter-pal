package services

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"
	"tweet-generate/models"

	// "github.com/openai/gpt-3-go/gpt"
	// gpt "github.com/sashabaranov/go-openai"
	"github.com/google/generative-ai-go/genai"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/api/option"
)

func CreateTweet(tweet models.Tweet, db *mongo.Database) error {
	collection := db.Collection("tweets")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, tweet)
	if err != nil {
		return err
	}

	return nil
}

func GetTweets(userID string, db *mongo.Database) ([]models.Tweet, error) {
	collection := db.Collection("tweets")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var tweets []models.Tweet
	// userIDPrimitive, _ := primitive.ObjectIDFromHex(userID)
	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &tweets); err != nil {
		return nil, err
	}

	return tweets, nil
}

func UpdateTweet(tweetID string, content string, db *mongo.Database) error {
	collection := db.Collection("tweets")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tweetIDPrimitive, _ := primitive.ObjectIDFromHex(tweetID)
	_, err := collection.UpdateOne(ctx, bson.M{"_id": tweetIDPrimitive}, bson.M{"$set": bson.M{"content": content}})
	if err != nil {
		return err
	}

	return nil
}

func DeleteTweet(tweetID string, db *mongo.Database) error {
	collection := db.Collection("tweets")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tweetIDPrimitive, _ := primitive.ObjectIDFromHex(tweetID)
	_, err := collection.DeleteOne(ctx, bson.M{"_id": tweetIDPrimitive})
	if err != nil {
		return err
	}

	return nil
}

func GenerateTweet(topic string, keywords []string, tone string, GEMINI_KEY string, db *mongo.Database) (string, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(GEMINI_KEY))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	model := client.GenerativeModel("gemini-1.5-flash")

	prompt := "You are a skilled social media manager with a strong background in crafting engaging and relatable tweets that resonate with audiences. Your expertise lies in understanding audience sentiment and utilizing a conversational tone that resonates with followers while effectively conveying key messages. Your task is to create a tweet that captures the essence of a given topic. Your task is just provide the tweet to be posted without adding any additional context or complaints.  Please consider the following details to ensure the tweet is on point and appealing:" + "Topic: " + topic + " Tone: " + tone + " keywords: " + strings.Join(keywords, ", ") + " Keep in mind that the tweet should feel authentic and human-like, encouraging interaction and engagement from readers. Aim for clarity and brevity, while conveying the core message in an inviting manner. It should also aim to encourage engagement, such as likes, retweets, or comments. Here are some examples of how you might approach this: For a humorous tone, consider incorporating a clever twist or pun related to the topic. For an inspirational tone, focus on a motivational quote or an uplifting message that aligns with the keywords. "
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Fatal(err)
	}
	formattedContent := formatResponse(resp)
	fmt.Println("Formatted content: ", formattedContent)

	return formattedContent, nil
}

func formatResponse(resp *genai.GenerateContentResponse) string {
	var formattedContent strings.Builder
	if resp != nil && resp.Candidates != nil {
		for _, cand := range resp.Candidates {
			if cand.Content != nil {
				for _, part := range cand.Content.Parts {
					formattedContent.WriteString(fmt.Sprintf("%v", part))
				}
			}
		}
	}
	return formattedContent.String()
}
