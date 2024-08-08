package services

import (
	"encoding/json"
	"errors"
	"fmt"
  "time"

	"net/http"

	twitterscraper "github.com/n0madic/twitter-scraper"
  // "github.com/g8rswimmer/go-twitter/v2"
	// "github.com/dghubble/oauth1"
	"github.com/patrickmn/go-cache"
  // "tweet-generate/config"
  g "github.com/serpapi/google-search-results-golang"
	// "strconv"
)

type Configuration struct {

	WOEID int64
}


var (
	cach = cache.New(5*time.Minute, 10*time.Minute)
	configuration = Configuration{}
)



type Trend struct {
  Title   string `json:"title"`
	Link    string `json:"link"`
	Snippet string `json:"snippet"`
}

type TrendsResponse struct {
    Trends []Trend `json:"trends"`
}



func GetTrends( country string, Serpapi_key string, cat string) ([]Trend, error) {
  println("category: ", cat)
  if cat==""{
    cat="all"
  }

  if country==""{
    country="US"
  }
  country="US"
  parameter := map[string]string{
    "engine": "google_trends_trending_now",
    "frequency": "realtime",
    "geo": country,
    "cat": cat,
  }

  search := g.NewGoogleSearch(parameter, Serpapi_key)
  results, err := search.GetJSON()
  if err != nil {
    fmt.Println("cant find trends",err)
  }
  realtime_searches, ok := results["realtime_searches"].([]interface{})
  if !ok {
		fmt.Println("failed to assert realtime_searches")
		return nil, fmt.Errorf("failed to assert realtime_searches")
	}
  var trends []Trend

  for _, searchItem := range realtime_searches{
    searchMap, ok := searchItem.(map[string]interface{})
		if !ok {
			continue
		}
    articles, ok := searchMap["articles"].([]interface{})
		if !ok {
			continue
		}

    for _, articleItem := range articles {
			articleMap, ok := articleItem.(map[string]interface{})
			if !ok {
				continue
			}
			title, _ := articleMap["title"].(string)
			link, _ := articleMap["link"].(string)
			snippet, _ := articleMap["snippet"].(string)
			trend := Trend{
				Title:   title,
				Link:    link,
				Snippet: snippet,
			}
			trends = append(trends, trend)
		}
  }

  fmt.Println(trends)
	return trends, nil

}


func getTwitterTrends(woeid int, bearerToken string) ([]Trend, error) {
    // fmt.Println(woeid)
    scraper:= twitterscraper.New()
    err:= scraper.LoginOpenAccount()
    if err != nil {
      panic(err)
  }

  trends, err := scraper.GetTrends()
  if err != nil {
      panic(err)
  }
  fmt.Println(trends)

    url := "https://api.twitter.com/1.1/trends/place.json?id=1"
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
		return nil, err
    }
	
    req.Header.Set("Authorization", "Bearer "+bearerToken)
    req.Header.Set("Authorization", "AccessToken "+bearerToken) 
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
		return nil, err
    }
    defer resp.Body.Close()
	
    if resp.StatusCode != http.StatusOK {
        return nil, errors.New("failed to get trends from Twitter")
    }
	
    var trendsResponse []TrendsResponse
    if err := json.NewDecoder(resp.Body).Decode(&trendsResponse); err != nil {
        return nil, err
    }

    if len(trendsResponse) == 0 {
		return nil, errors.New("no trends found")
    }

    return trendsResponse[0].Trends, nil
}

func getWOEID(country string) int {
    if woeid, exists := locationToWOEID[country]; exists {
		return woeid
    }
    return 0 
}


var locationToWOEID = map[string]int{
	"Worldwide":     1,
	"United States": 23424977,
	"India":         23424848,
	"New York":      2459115,
	"Los Angeles":   2442047,
	"Pakistan" : 	 2211387,
	"Austria" : 	 23424750,
	"Japan":         90036018,
	"Russia":        2018708,
}