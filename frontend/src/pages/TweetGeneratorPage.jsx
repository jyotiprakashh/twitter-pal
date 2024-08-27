import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const TweetGeneratorPage = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const { addTweet } = useStore();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const state = useLocation().state;

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      toast.error('Please sign in to access this page.');
      navigate('/signup');
    }
    if(state){
      setTopic(state.name);
      setKeywords([...keywords, state.context]);
    }
  }, [user, navigate, state]);

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleGenerateTweet = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('tweetheats-jd9i0y39.b4a.run/api/tweets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Token': token },
        body: JSON.stringify({ topic, keywords, tone }),
      });
      const data = await res.json();
      console.log(data);
      setGeneratedTweet(data.Content);
    } catch (error) {
      toast.error(error.message || 'Failed to generate tweet');
    }
  };

  const handleSaveTweet = () => {
    addTweet(generatedTweet);
    toast.success('Tweet saved!');
  };

  const handlePostToTwitter = () => {
    const tweetContent = encodeURIComponent(generatedTweet);
    window.open(`https://twitter.com/intent/tweet?text=${tweetContent}`, '_blank');
  };

  const handleReset = () => {
    setTopic('');
    setKeywords([]);
    setTone('professional');
    setGeneratedTweet('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-X-black md:flex-row flex-col mt-5">
      

      <div className="bg-X-gray rounded-lg p-9 shadow-lg w-full max-w-md border border-opacity-35 border-X-Darkgray">
        <h2 className="text-2xl font-bold mb-4 text-X-Extralightgray">Generate a Tweet</h2>
        <p className='mb-6 text-X-Extralightgray'>Enter your topic, keywords, and desired tone to generate a tweet.</p>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-X-Darkgray">Topic</label>
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            className="w-full p-3 border text-X-Extralightgray bg-X-gray border-X-Darkgray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-X-blue transition-all duration-300"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-X-Darkgray">Keywords</label>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleAddKeyword}
            placeholder="Press enter to add keyword"
            className="w-full p-3 border border-X-Darkgray text-X-Extralightgray bg-X-gray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-X-blue transition-all duration-300"
          />
          <div className="flex flex-wrap mt-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="bg-X-black text-X-Darkgray px-3 py-1 rounded-full mr-2 mb-2 flex items-center shadow-md">
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-X-Darkgray">Tone</label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)} 
            className="w-full p-3 border bg-X-gray text-X-Extralightgray border-X-Darkgray rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-X-blue transition-all duration-300"
          >
            <option value="professional">Professional</option>
            <option value="informal">Informal</option>
            <option value="humorous">Humorous</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
        
        <button 
          onClick={handleGenerateTweet} 
          className="w-full px-6 py-3 bg-X-blue text-white rounded-md shadow-md hover:bg-X-Darkgray transition-colors duration-300 mb-4"
        >
          Generate Tweet
        </button>
        <button onClick={handleReset} className='w-full px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300 mb-4'> Reset </button>
      

        
         
      </div>

       {/* Generated Tweet Card */}
       {generatedTweet && (
          <div
            className="bg-X-black p-8 m-8 rounded-lg shadow-lg w-full md:w-4/12 transition-all duration-500 transform animate-sweep"
            style={{ animationDuration: '0.7s', animationTimingFunction: 'ease-in-out' }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center text-X-Darkgray">Generated Tweet!</h2>
            <textarea
              value={generatedTweet}
              onChange={(e) => setGeneratedTweet(e.target.value)}
              className="w-full p-4 bg-X-black/80 text-white border border-X-Darkgray border-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-X-blue transition-all duration-300 resize-none"
              rows="6"
            />
            {generatedTweet && (
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(generatedTweet)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block text-center mt-4 mb-4 px-6 py-3 bg-X-blue text-white rounded-lg shadow-md hover:bg-X-Darkgray transition-colors duration-300"
          >
            Post to Twitter
          </a>
        )}
            <button
              onClick={handleSaveTweet}
              className="w-full mb-4 px-6 py-3 bg-X-Extralightgray text-X-black rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
            >
              Save Tweet
            </button>

          </div>
        )}
    </div>
  );
};

export default TweetGeneratorPage;
