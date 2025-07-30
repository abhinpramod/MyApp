import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const { store } = useSelector((state) => state.store);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contractors", path: "/contractors" },
    { name: "Stores", path: "/stores" },
    { name: "About", path: "/about" },
  ];

  // Determine if any account is logged in
  const isLoggedIn = user || contractor || store;
  
  // Determine profile picture if logged in
  const profilePicture = 
    user?.profileImage || 
    contractor?.profilePicture || 
    store?.profilePicture;

  // Get profile route based on user type
  const getProfileRoute = () => {
    if (user) return "/userprofile";
    if (contractor) return "/contractor/ContractorProfile";
    if (store) return "/store/storeprofile";
    return "/loginuser";
  };

  // Check if current path is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with gradient text */}
          <Link
            to="/"
            className="group relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent tracking-wider relative"
            >
              LocalFinder
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative group px-4 py-2 rounded-xl transition-all duration-300"
              >
                <motion.span
                  className={`text-lg font-medium transition-all duration-300 relative z-10 ${
                    isActiveLink(item.path)
                      ? 'text-white'
                      : 'text-gray-700 group-hover:text-white'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {item.name}
                </motion.span>
                
                {/* Active/Hover Background */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  isActiveLink(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-100'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 scale-0 group-hover:scale-100'
                }`}></div>
              </Link>
            ))}
          </div>

          {/* Desktop Profile Section */}
          <div className="hidden lg:flex items-center">
            <Link
              to={getProfileRoute()}
              className="group flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {isLoggedIn ? (
                  profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
                      <img src="/avatar.png" alt="Avatar" className="w-6 h-6" />
                    </div>
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                )}
                
                {/* Online indicator for logged in users */}
                {isLoggedIn && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </motion.div>
              
              {!isLoggedIn && (
                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300">
                  Sign In
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Section */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Profile Icon */}
            <Link
              to={getProfileRoute()}
              className="group relative"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {isLoggedIn ? (
                  profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                      <img src="/avatar.png" alt="Avatar" className="w-6 h-6" />
                    </div>
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                )}
                
                {isLoggedIn && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </motion.div>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 border border-gray-300 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} className="text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} className="text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={menuItemVariants}
                  custom={index}
                >
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActiveLink(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;