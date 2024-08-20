package services

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"net/http"

	// "github.com/g8rswimmer/go-twitter/v2"
	// "github.com/dghubble/oauth1"
	// "tweet-generate/config"
	// g "github.com/serpapi/google-search-results-golang"
	// "strconv"
	// "github.com/dghubble/oauth1"
	// "github.com/patrickmn/go-cache"
)

type Configuration struct {
	APIKey       string
	APISecret    string
	AccessToken  string
	AccessSecret string
	WOEID       int64 // Unused in API v2 but kept for reference
}



type Trend struct {
  	TrendName   string `json:"trend_name"`
	TweetCount    int64 `json:"tweet_count"`
}

type TrendsResponse struct {
    Trends []Trend `json:"data"`
}

// type customTrend struct {
// 	Name        string `json:"name"`
// 	URL         string `json:"url"`
// 	TweetVolume int64  `json:"tweet_volume"`
// }




func GetTrends( country string, Serpapi_key string, cat string) ([]Trend, error) {
  // println("category: ", cat)
  // if cat==""{
  //   cat="all"
  // }

  // if country==""{
  //   country="US"
  // }
  // // country="US"
  // parameter := map[string]string{
  //   "engine": "google_trends_trending_now",
  //   "frequency": "realtime",
  //   "geo": country,
  //   "cat": cat,
  // }

  // search := g.NewGoogleSearch(parameter, Serpapi_key)
  // results, err := search.GetJSON()
  // if err != nil {
  //   fmt.Println("cant find trends",err)
  // }
  // realtime_searches, ok := results["realtime_searches"].([]interface{})
  // if !ok {
	// 	fmt.Println("failed to assert realtime_searches")
	// 	return nil, fmt.Errorf("failed to assert realtime_searches")
	// }
  // var trends []Trend

  // for _, searchItem := range realtime_searches{
  //   searchMap, ok := searchItem.(map[string]interface{})
	// 	if !ok {
	// 		continue
	// 	}
  //   articles, ok := searchMap["articles"].([]interface{})
	// 	if !ok {
	// 		continue
	// 	}

  //   for _, articleItem := range articles {
	// 		articleMap, ok := articleItem.(map[string]interface{})
	// 		if !ok {
	// 			continue
	// 		}
	// 		title, _ := articleMap["title"].(string)
	// 		link, _ := articleMap["link"].(string)
	// 		snippet, _ := articleMap["snippet"].(string)
	// 		trend := Trend{
	// 			Title:   title,
	// 			Link:    link,
	// 			Snippet: snippet,
	// 		}
	// 		trends = append(trends, trend)
	// 	}
  // }

  // fmt.Println(trends)
	// return trends, nil














//   var trends []customTrend
    fmt.Println("hello")
	bearerToken := os.Getenv("TWITTER_BEARER_TOKEN")
	// woeid:= 1;
	url := "https://api.x.com/2/trends/by/woeid/1"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("could not create request: %w", err)
	}
	// req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", bearerToken))
	req.Header.Add("Authorization: ", bearerToken)


	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("could not send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d, response: %s", resp.StatusCode, string(body))
	}

	var trendsResponse TrendsResponse
	err = json.Unmarshal(body, &trendsResponse)
	if err != nil {
		return nil, fmt.Errorf("could not parse JSON response: %w", err)
	}
	if(len(trendsResponse.Trends)==0){
		return nil, fmt.Errorf("could not parse JSON response: %w", err)
	}
	fmt.Println("trends: ")
	fmt.Println(trendsResponse.Trends)


	return trendsResponse.Trends, nil

}


// func getTwitterTrends(woeid int, bearerToken string) ([]Trend, error) {
//     // fmt.Println(woeid)
//     scraper:= twitterscraper.New()
//     err:= scraper.LoginOpenAccount()
//     if err != nil {
//       panic(err)
//   }

//   trends, err := scraper.GetTrends()
//   if err != nil {
//       panic(err)
//   }
//   fmt.Println(trends)

//     url := "https://api.twitter.com/1.1/trends/place.json?id=1"
//     req, err := http.NewRequest("GET", url, nil)
//     if err != nil {
// 		return nil, err
//     }
	
//     req.Header.Set("Authorization", "Bearer "+bearerToken)
//     req.Header.Set("Authorization", "AccessToken "+bearerToken) 
//     client := &http.Client{}
//     resp, err := client.Do(req)
//     if err != nil {
// 		return nil, err
//     }
//     defer resp.Body.Close()
	
//     if resp.StatusCode != http.StatusOK {
//         return nil, errors.New("failed to get trends from Twitter")
//     }
	
//     var trendsResponse []TrendsResponse
//     if err := json.NewDecoder(resp.Body).Decode(&trendsResponse); err != nil {
//         return nil, err
//     }

//     if len(trendsResponse) == 0 {
// 		return nil, errors.New("no trends found")
//     }

//     return trendsResponse[0].Trends, nil
// }

// func getWOEID(country string) int {
//     if woeid, exists := locationToWOEID[country]; exists {
// 		return woeid
//     }
//     return 0 
// }


// var locationToWOEID = map[string]int{
// 	"Worldwide":     1,
// 	"United States": 23424977,
// 	"India":         23424848,
// 	"New York":      2459115,
// 	"Los Angeles":   2442047,
// 	"Pakistan" : 	 2211387,
// 	"Austria" : 	 23424750,
// 	"Japan":         90036018,
// 	"Russia":        2018708,
// }