package services

import (
    "context"
    "errors"
    "time"
    "tweet-generate/models"
    "tweet-generate/utils"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
)

func SignUp(user models.User, db *mongo.Database) error {
    collection := db.Collection("users")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    var existingUser models.User
    err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)
    if err == nil {
        return errors.New("user already exists")
    }

    _, err = collection.InsertOne(ctx, user)
    if err != nil {
        return err
    }

    return nil
}

func Login(email, password string, db *mongo.Database, jwtSecret string) (string, error) {
    collection := db.Collection("users")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var user models.User
    err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
    if err != nil {
        return "", errors.New("user not found")
    }

    if !utils.CheckPasswordHash(password, user.Password) {
        return "", errors.New("incorrect password")
    }

    token, err := utils.GenerateJWT(user.ID.Hex(), jwtSecret)
    if err != nil {
        return "", err
    }

    return token, nil
}


func GetUserName(email string, db *mongo.Database) string {
    var user models.User
    err := db.Collection("users").FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
    if err != nil {
        return ""
    }
    return user.Username
}
