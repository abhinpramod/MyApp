import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  BellRing,
  User,
  Home,
  PackagePlus,
  ShoppingCart,
  History,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";

const StoreDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    handleCloseDialog();
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar - matches contractor layout exactly */}
        <aside
          className={`bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          } ${isMobile ? "z-50" : ""}`}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none self-end"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <nav className="space-y-4 mt-4 flex-1">
            <Link
              to="/store/storeDashboard"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <LayoutDashboard />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
            </Link>
            <Link
              to="/store/storeProfile"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <User />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Profile</span>
            </Link>
            <Link
              to="/store/addProduct"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <PackagePlus />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Manage Products</span>
            </Link>
            <Link 
              to="/store/orders"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <ShoppingCart />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Orders</span>
            </Link>
            <Link
              to="/store/orderhistory"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <History />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Order History</span>
            </Link>
            <Link
              to="/store/storesettings"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <Settings />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Settings</span>
            </Link>
          </nav>
          
          <div className="mt-auto space-y-2">
            {/* <Button 
              onClick={() => navigate("/")} 
              className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-800 ${
                isSidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <Home />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Home</span>
            </Button> */}
            <Button
              onClick={handleOpenDialog}
              className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-800 text-red-400 hover:text-red-300 ${
                isSidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <LogOut />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area - matches contractor layout */}
        <div className="flex flex-col flex-1">
          {/* Navbar - fixed position with proper left spacing */}
          <header
            className={`bg-white shadow-md w-full fixed top-0 h-16 flex items-center px-6 justify-between z-40 transition-all duration-300 ${
              isSidebarOpen ? "left-64" : "left-20"
            }`}
          >
            <h1 className="text-lg font-semibold text-gray-800">Store Dashboard</h1>
            <button 
              className={`flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors ${
                isSidebarOpen ? "mr-60" : "mr-20"
              }`} 
              onClick={() => navigate("/")}
            >
              <Home className="w-5 h-5 text-gray-800" />
            </button>
          </header>
          
          {/* Content Area with proper margin */}
          <main
            className={`p-6 overflow-auto flex-1 bg-gray-100 transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-20"
            }`}
            style={{ paddingTop: "4rem" }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} style={{ zIndex: 9999 }}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreDashboard;