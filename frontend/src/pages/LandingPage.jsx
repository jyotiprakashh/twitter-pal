import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const {trendingTopics, setTrendingTopics} = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Uncomment and use your actual API endpoint
    if (trendingTopics.length === 0){
      fetch('http://localhost:3000/api/trends/')
      .then(res => res.json())
      .then(data => setTrendingTopics(data))
      .catch(err => console.error(err));
    }
    
    // setTrendingTopics([
    //   { name: 'Trending Topic 1', description: 'Description of Trending Topic 1', context: 'Context of Trending Topic 1' },
    //   { name: 'Trending Topic 2', description: 'Description of Trending Topic 2', context: 'Context of Trending Topic 2' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    //   { name: 'Trending Topic 3', description: 'Description of Trending Topic 3', context: 'Context of Trending Topic 3' },
    // ]);
  }, [trendingTopics, setTrendingTopics]);

  const handleGenerateClick = (topic) => {
    // setActiveTrend(topic);
    navigate('/generate-tweet', {state: topic});
  };


  return (
    <div className="bg-X-black text-white min-h-screen flex flex-col">
      <section className="flex flex-col items-center justify-center h-screen text-center p-8 space-y-6 md:space-y-8">
        <h1 className="text-7xl sm:text-9xl font-bold md:mb-4 leading-tight">Tweet Heats</h1>
        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
          Discover the power of AI-generated tweets tailored to your region's trending topics. Effortlessly boost your social media presence and engagement.
        </p>
        <div className='flex flex-col md:flex-row gap-4 md:gap-10'>
          <a href="#trending" className="px-8 py-3 bg-X-blue text-white rounded-full font-semibold shadow hover:bg-X-Darkgray transition-colors duration-300">
            Discover Trending Topics
          </a>
          <Link 
            to="/generate-tweet" 
            className="px-4 py-2 hover:underline text-white rounded-full border-2 border-white w-full md:w-56 text-center"
          >
            Generate
          </Link>
        </div>
      </section>

      <section id="trending" className="bg-X-darkBlack text-X-black py-16 flex-grow">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center text-X-Extralightgray">Trending Topics in Your Area</h2>
    {trendingTopics.length > 0 ? (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {trendingTopics.map((topic, index) => (
          <div 
            key={index} 
            className="bg-X-Extralightgray rounded-lg shadow-lg hover:shadow-xl hover:shadow-black overflow-hidden transform hover:-translate-y-1 hover:scale-105 transition-transform duration-300"
          >
            <div className="p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-X-black">{topic.name}</h3>
              <p className="text-base md:text-lg text-X-Darkgray mb-3">{topic.description}</p>
              <span className="text-sm text-X-Lightgray block mb-4">{topic.context}</span>
              <button
                onClick={() => handleGenerateClick(topic)}
                className="mt-auto px-6 py-3 bg-X-blue text-white rounded-lg shadow-md hover:bg-X-Darkgray transition-colors duration-300 w-full"
              >
                Generate Tweet
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-lg md:text-xl text-X-Darkgray">Loading trending topics...</p>
    )}
  </div>
</section>

    </div>
  );
};

export default LandingPage;
