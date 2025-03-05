import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Briefcase, LogIn } from "lucide-react";
import React from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/30 shadow-lg border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-extrabold text-red-600 tracking-wider"
          >
            LocalFinder
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            {[
              { name: "Home", path: "/" },
              { name: "Contractors", path: "/contractors/contractors" },
              { name: "Stores", path: "/stores" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 text-lg font-medium hover:text-red-600 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex space-x-6">
            <Link
              to="/Logincontractors"
              className=" py-3 text-lg font-semibold  transition-all duration-300  hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              contractor
            </Link>

            <Link
              to="/contractor/registercontractorstep1"
              className=" py-3 text-lg font-semibold  transition-all duration-300  hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              store
            </Link>
          </div>
          <Link
            to="/loginuser"
            className="text-gray-900 hover:text-red-600 transition-all duration-300"
          >
            <LogIn size={20} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/90 border-t border-gray-200 shadow-lg absolute top-20 left-0 w-full p-6">
          <div className="flex flex-col items-center space-y-6 text-lg font-medium">
            {[
              { name: "Home", path: "/" },
              { name: "Contractors", path: "/Logincontractors" },
              { name: "Stores", path: "/stores" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 hover:text-red-600 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/loginuser"
              className="text-gray-900 hover:text-red-600 transition-all duration-300"
            >
              <LogIn size={20} />
            </Link>

            <Link
              to="/contractor/registercontractorstep1"
              className="px-6  text-lg font-semibold  transition-all duration-300  hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              contractor
            </Link>
            <Link
              to="/Logincontractors"
              className="px-6  text-lg font-semibold  transition-all duration-300  hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              store
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
