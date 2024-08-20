package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
    ID       primitive.ObjectID `bson:"_id,omitempty"`
    Username string             `bson:"username"`
    Email    string             `bson:"email"`
    Password string             `bson:"password"`
}

type Tweet struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"` 
    UserID    string             `bson:"user_id"`
    Topic     string             `bson:"topic"`
    Content   string             `bson:"content"`
    Keywords  []string           `bson:"keywords"`
    Tone      string             `bson:"tone"`
    CreatedAt int64              `bson:"created_at"`
	UpdatedAt int64              `bson:"updated_at"`
}


