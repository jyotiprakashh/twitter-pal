import React, { useEffect, useState } from 'react';
import useStore from '../store';

const LandingPage = () => {
  const { user } = useStore();
  const [trendingTopics, setTrendingTopics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/trends/')
      .then(res => res.json())
      .then(data => setTrendingTopics(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-6">Welcome to Tweet Generator</h2>
      <p className="text-lg mb-6">Generate tweets based on the latest trends in your area.</p>
      
      {trendingTopics.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Trending Topics in Your Area</h3>
          <ul className="list-disc list-inside">
            {trendingTopics.map((topic, index) => (
              <li key={index}>{topic.title} - {topic.link} - {topic.snippet}</li>
            ))}
          </ul>
        </div>
      )}
      
      {!user && (
        <div className="mt-6">
          <a href="/signup" className="px-6 py-2 bg-green-500 text-white rounded">Sign Up Now</a>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
