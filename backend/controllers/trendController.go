package controllers

import (
	"fmt"
	"net"
	// "strings"
	"tweet-generate/services"

	// "tweet-generate/config"

	"github.com/gofiber/fiber/v2"
	"github.com/ipinfo/go/v2/ipinfo"
)


type GeolocationResponse struct {
    Country  string `json:"country"`
    Region   string `json:"region"`
    City     string `json:"city"`
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
}

type Trend struct {
    Name string `json:"name"`
    URL  string `json:"url"`
}

type TrendsResponse struct {
    Trends []Trend `json:"trends"`
}



func GetTrends(c *fiber.Ctx, ipinfo string, Serpapi_key string, RapidAPIKey string) error {
    // ip := c.IP()

    ip := c.Get("X-Real-IP")
    if ip==""{
        ip= c.Get("X-Forwarded-For")
    }
    if ip==""{
        ip= c.Get("X-FORWARDED-FOR")
    }
    if ip==""{
        ip= c.Get("X-forwarded-for")
    }
    // forwarder:= c.Get("X-Forwarded-For")
    // if(forwarder != ""){
    //     ip := strings.Split(forwarder, ",")[0]
    //     if len(ip)>0{
    //         ip = strings.TrimSpace(ip)
    //     }
    // }
    fmt.Println(ip)
    location, err := getLocationFromIP(ip, ipinfo)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }
fmt.Println("your location is: " +location.Country)
    trends, err := services.GetTrends(location.Country, RapidAPIKey, c.Get("category"))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(trends)
}


func getLocationFromIP(ip string, ipinfoo string) (*GeolocationResponse, error) {
    token := ipinfoo
    fmt.Println(ip)
    client := ipinfo.NewClient(nil, nil, token)
    info, err := client.GetIPInfo(net.ParseIP(ip))

    if err != nil {
        return nil, fmt.Errorf("failed to get location: %v", err)
    }
    // fmt.Println("hello" ,info)


    var location GeolocationResponse

    location.Country = info.Country
    location.Region = info.Region
    location.City = info.City
    println(location.Country)
    return &location, nil
}

