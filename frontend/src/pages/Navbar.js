import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Check if token exists in localStorage to deduce login status
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Direct user to login after clearing authentication
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
          TaskTracker
        </Link>

        {/* Conditional Navigation Links */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;