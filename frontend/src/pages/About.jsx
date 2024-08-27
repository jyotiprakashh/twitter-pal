import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-X-black p-4">
      <div className="bg-X-black p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-X-blue mb-4">About</h1>
        <p className="text-lg text-white mb-4">
          Welcome to Tweet Heats! I'm Jyoti Prakash, the sole creator behind this project.
        </p>
        <p className="text-lg text-white">
          This website generates tweets based on your input. I hope you find it useful and fun to use!
        </p>
      </div>
    </div>
  );
};

export default About;
