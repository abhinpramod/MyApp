import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../lib/axios"

const Navbar = ({ isOwnerView }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const { store } = useSelector((state) => state.store);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contractors", path: "/contractors" },
    { name: "Stores", path: "/stores" },
    { name: "About", path: "/about" },
  ];
 

  // Determine if any account is logged in
  const isLoggedIn = user || contractor || store;
   const logout=()=>{
axiosInstance.post(`/${isLoggedIn}/logout`)
  }

  // Determine profile picture if logged in
  const profilePicture =
    user?.profileImage ||
    contractor?.profilePicture ||
    store?.profilePicture;

  // Determine profile name if logged in
  const profileName =
    user?.name ||
    contractor?.companyName ||
    store?.storeName ||
    "Account";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200 ${isOwnerView ? "" : ""}`}>
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              LocalFinder
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      {profileName.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium hidden xl:block">
                    {profileName}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <Link
                      to={
                        user ? "/userprofile" :
                        contractor ? "/contractor/ContractorProfile" :
                        store ? "/store/storeprofile" :
                        "/loginuser"
                      }
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    {/* <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link> */}
                    <hr className="my-2 border-gray-100" />
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                      onClick={() => logout()}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/loginuser"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button and Profile Icon */}
          <div className="lg:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                to={
                  user ? "/userprofile" :
                  contractor ? "/contractor/ContractorProfile" :
                  store ? "/store/storeprofile" :
                  "/loginuser"
                }
                className="p-1"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {profileName.charAt(0)}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                to="/loginuser"
                className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg"
              >
                Login
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute top-16 left-0 w-full py-2">
          <div className="flex flex-col px-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-3 font-medium transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  to="/loginuser"
                  className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;