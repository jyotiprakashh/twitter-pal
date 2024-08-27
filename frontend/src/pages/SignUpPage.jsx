import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { setUser } = useStore();
  const setUserName = useStore((state) => state.setUserName);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('tweetheats-jd9i0y39.b4a.run/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        console.log(response);
        const error = await response.json();
        throw new Error(error.error || 'Sign up failed');
      }

      const data = await response.json();
      setUser({ email: data.email });
      console.log(data)
      localStorage.setItem('token', data.token);
      setUserName (data.user);
      toast.success('Sign up successful!');
      navigate('/generate-tweet');
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Sign up failed');
    }
  };

  return (
    <div className='bg-X-black'>
    <div className="container mx-auto p-8 min-h-screen w-full flex items-center justify-center">
  <div className="bg-X-gray rounded-md p-10 py-16 shadow-lg w-full max-w-md border border-opacity-35 border-X-Darkgray">
    <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>
    <form onSubmit={handleSignUp}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-X-Extralightgray">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-2 border border-X-Extralightgray border-opacity-35 bg-X-gray rounded mt-1 text-X-Extralightgray placeholder-X-Lightgray"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-X-Darkgray">Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-2 border border-X-Extralightgray border-opacity-35  bg-X-gray rounded mt-1 text-X-Extralightgray placeholder-X-Lightgray"
          placeholder="Choose a username"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-X-Darkgray">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-2 border border-X-Extralightgray border-opacity-35 bg-X-gray rounded mt-1 text-X-Extralightgray placeholder-X-Lightgray"
          placeholder="Create a password"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full px-6 py-2 bg-X-blue hover:bg-X-Darkgray text-white rounded-lg font-semibold transition-colors duration-300"
      >
        Sign Up
      </button>
    </form>
    <p className="text-center mt-4 text-sm text-gray-400">Already have an account? <a href="/login" className="text-X-blue hover:underline">Login</a></p>
  </div>
</div>
</div>

  
  );
};

export default SignUpPage;
