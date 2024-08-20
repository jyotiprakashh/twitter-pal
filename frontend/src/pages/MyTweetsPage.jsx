import React, { useEffect } from 'react';
import useStore from '../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../components/useAuth';

const MyTweetsPage = () => {
  const { tweets, removeTweet, setTweets, user } = useStore();
  const navigate = useNavigate();



  useEffect(() => {
    const fetchTweets = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const res = await fetch('http://localhost:3000/api/tweets', {
          method: 'GET',
          headers: {
            'Token': `${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTweets(data);
        } else {
          toast.error('Failed to fetch tweets.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching tweets.');
        console.error('Failed to fetch tweets:', error);
      }
    };

    fetchTweets();
  }, [setTweets]);

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to access this page.');
      navigate('/signup');
    }
  }, [user, navigate, useAuth()]);

  if (!tweets) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">My Generated Tweets</h2>
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet, index) => (
            <li key={index} className="mb-4 p-4 bg-gray-100 rounded">
              <p>{tweet.Content}</p>
              <p>{tweet.CreatedAt}</p>
              <button 
                onClick={() => removeTweet(index)} 
                className="px-4 py-2 bg-red-500 text-white rounded mt-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tweets generated yet.</p>
      )}
    </div>
  );
};

export default MyTweetsPage;
