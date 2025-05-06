import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Navbar = (isOwnerView) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const { store } = useSelector((state) => state.store);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contractors", path: "/contractors" },
    { name: "Stores", path: "/stores" },
    { name: "About", path: "/about" },
  ];

  // Determine profile picture based on who is logged in
  const profilePicture = 
    user?.profileImage || 
    contractor?.profilePicture || 
    store?.profilePicture;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b ${isOwnerView ? "" : "hidden"} border-gray-200`}>
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

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex space-x-6">
            <Link
              to={
                user ? "/userprofile" :
                contractor ? "/contractor/ContractorProfile" :
                store ? "/store/storeprofile" :
                "/loginuser"
              }
              className="py-1 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {profilePicture ? (
                <img
                  src={profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User size={24} />
              )}
            </Link>
          </div>

          {/* Mobile Menu Button and Profile Icon */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile Profile Icon - same as desktop but always visible */}
            <Link
              to={
                user ? "/userprofile" :
                contractor ? "/contractor/ContractorProfile" :
                store ? "/store/storeprofile" :
                "/loginuser"
              }
              className="text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {profilePicture ? (
                <img
                  src={profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User size={24} />
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="text-gray-900 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only navigation links */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute top-20 left-0 w-full p-6">
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-900 text-lg font-medium hover:text-red-600 transition-all duration-300 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;