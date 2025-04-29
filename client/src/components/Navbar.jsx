import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Briefcase, LogIn,User } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Navbar = (isOwnerView) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const {store} = useSelector((state) => state.store);
 

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Contractors", path: "/contractors" },
    { name: "Stores", path: "/stores" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b ${isOwnerView ? "": "hidden"} border-gray-200`}>
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

          {/* Auth Buttons */}
          <div className="hidden lg:flex space-x-6">
            {/* Show Contractor Profile or Login Button if no user or store is logged in */}
            {!user && !store && (
              <Link
                to="/contractor/Logincontractors"
                className="py-1 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {contractor?.verified && (
                  <img
                    src={contractor.profilePicture || "/avatar.png"}
                    alt="Contractor Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) }
              
              </Link>
            )}

            {/* Show Store Registration Button if no user or contractor is logged in */}
            {!user && !contractor && (
              <Link
                to="/store/storeprofile"
                className="py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {store && (
                  <img
                    src={store.profilePicture || "/avatar.png"}
                    alt="Store Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) }
              </Link>
            )}

            {/* Show User Profile or Login Button if no contractor or store is logged in */}
            {!contractor && !store && (
              <Link
                to="/loginuser"
                className="py-1 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {user ? (
                  <img
                    src={user.profileImage || "/avatar.png"}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
<User />                  )}
                {user ? "" : "Login"}
              </Link>
            )}
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

            {/* Show User Login Button if no contractor or store is logged in */}
            {!contractor && !store && (
              <Link
                to="/loginuser"
                className="text-gray-900 hover:text-red-600 transition-all duration-300"
              >
                <User size={20} />
              </Link>
            )}

            {/* Show Contractor Login Button if no user or store is logged in */}
            {!user && !store && (
              <Link
                to="/contractor/Logincontractors"
                className="px-6 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Briefcase size={20} />
                Contractor
              </Link>
            )}

            {/* Show Store Registration Button if no user or contractor is logged in */}
            {!user && !contractor && (
              <Link
                to="/storeLogin"
                className="px-6 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Briefcase size={20} />
                Store
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;