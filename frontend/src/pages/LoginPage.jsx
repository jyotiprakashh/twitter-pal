import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const setUserName = useStore((state) => state.setUserName);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://tweetheats-jd9i0y39.b4a.run/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setUserName(data.user);
        localStorage.setItem('user', data.user);
        toast.success('Login successful!');
        navigate('/generate-tweet');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className='bg-X-black'>
      <div className="container mx-auto p-8 min-h-screen w-full flex items-center justify-center">
        <div className="bg-X-gray rounded-md p-10 py-16 shadow-lg w-full max-w-md border border-opacity-35 border-X-Darkgray">
          <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
          <form onSubmit={handleLogin}>
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
              <label className="block text-sm font-medium text-X-Darkgray">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border border-X-Extralightgray border-opacity-35 bg-X-gray rounded mt-1 text-X-Extralightgray placeholder-X-Lightgray"
                placeholder="Enter your password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full px-6 py-2 bg-X-blue hover:bg-X-Darkgray text-white rounded-lg font-semibold transition-colors duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-400">Don't have an account? <a href="/signup" className="text-X-blue hover:text-X-Darkgray">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
