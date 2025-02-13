import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import React from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md  
     left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-4xl font-bold text-red-600 tracking-wide">
            LocalFinder
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            <Link to="/" className="text-gray-800 hover:text-red-600 text-lg">
              Home
            </Link>
            <Link to="/contractors" className="text-gray-800 hover:text-red-600 text-lg">
              Contractors
            </Link>
            <Link to="/stores" className="text-gray-800 hover:text-red-600 text-lg">
              Stores
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-red-600 text-lg">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex space-x-6">
            <Link to="/login" className="px-6 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white">
              Sign In
            </Link>
          
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="flex flex-col items-center space-y-4 py-6">
            <Link to="/" className="text-gray-800 hover:text-red-600 text-lg">
              Home
            </Link>
            <Link to="/contractors" className="text-gray-800 hover:text-red-600 text-lg">
              Contractors
            </Link>
            <Link to="/stores" className="text-gray-800 hover:text-red-600 text-lg">
              Stores
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-red-600 text-lg">
              About
            </Link>
            <Link to="/login" className="px-6 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white">
              Sign In
            </Link>
            <Link to="/register" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
