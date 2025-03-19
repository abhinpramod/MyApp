import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Briefcase, LogIn } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contractors", path: "/contractors/contractors" },
    { name: "Stores", path: "/stores" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-4xl font-extrabold text-red-600 tracking-wider">
            LocalFinder
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            {menuItems.map((item) => (
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
              to="/contractor/Logincontractors"
              className="py-1 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {contractor ? (
                <img src={contractor.profilePicture} alt="Contractor Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <Briefcase size={20} />
              )}
              {contractor ? "" : "Contractor"}
            </Link>

            <Link
              to="/contractor/registercontractorstep1"
              className="py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              Store
            </Link>
            <Link
              to="/loginuser"
              className="text-gray-900 mt-5 hover:text-red-600 transition-all duration-300"
            >
              <LogIn size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white/90 border-t border-gray-200 shadow-lg absolute top-20 left-0 w-full p-6">
          <div className="flex flex-col items-center space-y-6 text-lg font-medium">
            {menuItems.map((item) => (
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
              to="/contractor/Logincontractors"
              className="px-6 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              Contractor
            </Link>
            <Link
              to="/contractor/registercontractorstep1"
              className="px-6 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Briefcase size={20} />
              Store
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;