import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-3xl font-bold mb-4">Welcome to devBumble</h1>
    <p className="text-gray-600 mb-8">Connect with developers and build amazing projects together.</p>
    
    <Link to="/login">
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300">
        Login / Signup
      </button>
    </Link>
  </div>
);

export default Welcome;
