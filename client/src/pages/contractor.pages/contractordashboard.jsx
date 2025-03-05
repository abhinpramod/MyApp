import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Bell, User, Home, Briefcase, Settings, LogOut } from "lucide-react";
import Button from "@/components/ui/button";

const ContractorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State to track mobile view

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Always show sidebar on larger screens
      } else {
        setIsSidebarOpen(false); // Hide sidebar by default on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sticky Sidebar */}
      <aside
        className={`bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${isMobile ? "z-50" : ""}`} // Add z-50 for mobile to ensure sidebar is above content
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none self-end"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation Links */}
        <nav className="space-y-4 mt-4 flex-1">
          <Link
            to="/contractor/contractorhome"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } hover:bg-gray-800`}
          >
            <Home className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Home</span>
          </Link>
          <Link
            to="/contractor/ContractorProfile"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } hover:bg-gray-800`}
          >
            <User className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Profile</span>
          </Link>
          <Link
            to="/contractor/project"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } hover:bg-gray-800`}
          >
            <Briefcase className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Projects</span>
          </Link>
          <Link
            to="/contractor/settings"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } hover:bg-gray-800`}
          >
            <Settings className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Settings</span>
          </Link>
        </nav>

        {/* Logout Button at the Bottom */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } hover:bg-gray-800 text-red-400 hover:text-red-300`}
          >
            <LogOut className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        {/* Sticky Navbar */}
        <header
          className={`bg-white shadow-md w-full fixed top-0 h-16 flex items-center px-6 justify-between z-40 transition-all duration-300 ${
            isSidebarOpen ? "left-64" : "left-20"
          }`}
        >
          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-800">Contractor Dashboard</h1>

         
        </header>

        {/* Dynamic Main Content */}
        <main
          className={`p-6 overflow-auto flex-1 bg-gray-100 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
          style={{ paddingTop: "4rem" }} // Add padding-top to account for Navbar height
        >
          <Outlet /> {/* Render nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default ContractorDashboard;