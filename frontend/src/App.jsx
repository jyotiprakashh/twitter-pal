import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TweetGeneratorPage from './pages/TweetGeneratorPage';
import MyTweetsPage from './pages/MyTweetsPage';
import Footer from './pages/Footer';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Navbar className="" />
        <div>
      <Routes className="">

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/generate-tweet" element={<TweetGeneratorPage />} />
        <Route path="/my-tweets" element={<MyTweetsPage />} />
        <Route path="/about" element= {<About />} />
      </Routes>
      </div>
      <ToastContainer />
      <Footer />
    </Router>
  );
}

export default App;
