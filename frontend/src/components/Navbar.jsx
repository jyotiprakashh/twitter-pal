import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store';

const Navbar = () => {
  const { user, setUser } = useStore();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Tweet Generator</h1>
      <div>
        {user ? (
          <button onClick={() => setUser(null)} className="px-4 py-2 bg-red-500 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 bg-blue-500 rounded mr-2">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-500 rounded">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
