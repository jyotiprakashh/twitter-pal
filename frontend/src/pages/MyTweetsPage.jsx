import React, { useEffect, useState } from "react";
import useStore from "../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../components/useAuth";

const MyTweetsPage = () => {
  const { tweets, removeTweet, setTweets, user } = useStore();
  const navigate = useNavigate();
  const [tweetList, setTweetList] = useState(tweets);

  useEffect(() => {
    const fetchTweets = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/tweets", {
          method: "GET",
          headers: {
            Token: `${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // console.log(data);

          setTweetList(data);
          setTweets(data);
        } else {
          toast.error("Failed to fetch tweets.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching tweets.");
        console.error("Failed to fetch tweets:", error);
      }
    };

    fetchTweets();
  }, [setTweets]);

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      toast.error("Please sign in to access this page.");
      navigate("/signup");
    }
  }, [user, navigate, useAuth()]);

  const handleDeleteTweet = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/tweets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Token: `${token}`,
        },
      });

      if (res.ok) {
        toast.success("Tweet deleted successfully.");
        setTweetList(tweetList.filter((tweet) => tweet.ID !== id));
        setTweets(tweetList.filter((tweet) => tweet.ID !== id));
      } else {
        toast.error("Failed to delete tweet.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the tweet.");
      console.error("Failed to delete tweet:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-X-black text-white sm:p-12 pt-12">
    <div className="container mx-auto p-9">
      <h2 className="text-4xl font-bold mb-6 text-center">My Generated Tweets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tweetList.length > 0 ? (
          tweetList.map((tweet) => (
            <div
              key={tweet.ID}
              className="bg-X-darkBlack p-6 rounded-lg shadow-md transform hover:scale-105 hover:bg-X-lightBlack transition-transform duration-300 hover:shadow-lg"
            >
              <p className="text-lg mb-2">{tweet.Content}</p>
              <p className="text-sm text-gray-400 mb-4">{formatDate(tweet.CreatedAt)}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleDeleteTweet(tweet.ID)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(tweet.Content)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-X-blue text-white rounded hover:bg-X-Darkgray transition-colors"
                >
                  Tweet
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No tweets generated yet.
          </p>
        )}
      </div>
    </div>
  </div>
  

  );
};

export default MyTweetsPage;
