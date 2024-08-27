import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { user, setUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');

  };

  return (
    <nav className="bg-X-black backdrop-blur-md p-4 text-white flex flex-col md:flex-row justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between w-full md:w-auto">
        <h1 className="text-2xl font-medium tracking-tight text-X-Extralightgray">Tweet Heats</h1>
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div className={`flex-col gap-9 md:flex md:flex-row md:items-center w-full md:w-auto ${isOpen ? 'flex' : 'hidden'} md:flex`}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link 
            to="/generate-tweet" 
            className="relative px-4 py-2 text-white rounded-full font-semibold group transition-colors duration-300"
          >
            Generate
            <span className="absolute left-0 bottom-0 w-full bg-X-extraextralightgray transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{height: '1px'}}></span>
          </Link>
          <Link 
            to="/my-tweets" 
            className="relative px-4 py-2 text-white rounded-full font-semibold group transition-colors duration-300"
          >
            My Tweets
            <span className="absolute left-0 bottom-0 w-full bg-X-extraextralightgray transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{height: '1px'}}></span>
          </Link>
          <Link 
            to="/" 
            className="relative px-4 py-2 text-white rounded-full font-semibold group transition-colors duration-300"
          >
            Home
            <span className="absolute left-0 bottom-0  w-full bg-X-extraextralightgray transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{height: '1px'}}></span>
          </Link>
        </div>
        {user && localStorage.getItem('token') ? (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="text-white px-4 py-2 bg-gray-800 rounded-full flex items-center"
            >
              <span className="mr-2">Hello, {localStorage.getItem('user')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              to="/login" 
              className="relative px-4 py-2 bg-X-blue hover:bg-X-Darkgray text-white rounded-md font-semibold group shadow-md transition-transform duration-300 transform hover:scale-105"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="relative px-4 py-2 bg-X-Extralightgray hover:bg-X-extraextralightgray text-X-gray rounded-md font-semibold group shadow-md transition-transform duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
