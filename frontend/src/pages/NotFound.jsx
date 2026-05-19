import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <h2 className="text-2xl mt-4 dark:text-white">Page Not Found</h2>
      <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg">Go Home</Link>
    </div>
  </div>
);

export default NotFound;