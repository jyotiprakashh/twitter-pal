import React, { useState, useEffect  } from 'react';
import useStore from '../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../components/useAuth';



const TweetGeneratorPage = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const { addTweet } = useStore();
  const navigate = useNavigate();
  // const { setUser } = useAuth();
  const user = useStore((state) => state.user);
  
  useEffect(() => {
    console.log(user)

    if (!user) {
      toast.error('Please sign in to access this page.');
      navigate('/signup'); // Redirect to sign-up page if the user is not authenticated
    }
  }, [user, navigate, useAuth()]);

  useAuth();

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
      const res = await fetch('http://localhost:3000/api/tweets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,'Token': `${token}`},
        
        body: JSON.stringify({ topic, keywords, tone }),
      });
      const data = await res.json();
      setGeneratedTweet(data.Content);
    } catch (error) {
      toast.error(error.message || 'Failed to generate tweet');
    }
  };

  const handleSaveTweet = () => {
    addTweet(generatedTweet);
    alert('Tweet saved!');
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Generate a Tweet</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium">Topic</label>
        <input 
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          className="w-full p-2 border rounded mt-1"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium">Keywords</label>
        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={handleAddKeyword}
          placeholder="Press enter to add keyword"
          className="w-full p-2 border rounded mt-1"
        />
        <div className="flex flex-wrap mt-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="bg-gray-200 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
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
        <label className="block text-sm font-medium">Tone</label>
        <select 
          value={tone} 
          onChange={(e) => setTone(e.target.value)} 
          className="w-full p-2 border rounded mt-1"
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
        className="px-6 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Generate Tweet
      </button>
      
      {generatedTweet && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <textarea 
            value={generatedTweet} 
            onChange={(e) => setGeneratedTweet(e.target.value)} 
            className="w-full p-2 border rounded mt-1"
          />
        </div>
      )}
      
      <button 
        onClick={handleSaveTweet} 
        className="px-6 py-2 bg-green-500 text-white rounded"
      >
        Save Tweet
      </button>
    </div>
  );
};

export default TweetGeneratorPage;
