package controllers

import (
    // "context"
    // "time"
    "tweet-generate/models"
    "tweet-generate/services"
    "tweet-generate/utils"

    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/mongo"
)

func SignUp(c *fiber.Ctx, db *mongo.Database) error {
    var user models.User
    if err := c.BodyParser(&user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }


    hashedPassword, err := utils.HashPassword(user.Password)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
    }
    user.Password = hashedPassword

    if err := services.SignUp(user, db); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created successfully"})
}

func Login(c *fiber.Ctx, db *mongo.Database, jwtSecret string) error {
    var credentials struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    if err := c.BodyParser(&credentials); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    token, err := services.Login(credentials.Email, credentials.Password, db, jwtSecret)
    if err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(fiber.Map{"token": token, "user" : credentials})
}


