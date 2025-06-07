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
import axiosInstance from "../../lib/axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutstore } from "../../redux/storeslice";

const StoreDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    console.log("Logout clicked");  
    navigate("/");
    axiosInstance.post("/store/logout");
    handleCloseDialog();
    dispatch(logoutstore());
  };

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const response = await axiosInstance.get("/orders/notifications");
      console.log("Notification count:", response.data);
      const response2=await axiosInstance.get("/orders/to-be-deliver");
      setNotificationCount(response.data+response2.data);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
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
    
    // Fetch notification count when component mounts
    fetchNotificationCount();
    
    // Set up polling to check for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotificationCount, 30000);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
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
              <LayoutDashboard className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
            </Link>
            <Link
              to="/store/storeProfile"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <User className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Profile</span>
            </Link>
            <Link
              to="/store/addProduct"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <PackagePlus className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Manage Products</span>
            </Link>
            
            <Link
              to="/store/orders"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800 relative`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Orders
              </span>
              {notificationCount > 0 && (
                <span className={`absolute ${
                  isSidebarOpen ? "right-3" : "right-1/2 translate-x-1/2"
                } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                  {notificationCount}
                </span>
              )}
            </Link>
            <Link
              to="/store/orderhistory"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <History className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>cartData</span>
            </Link>
            <Link
              to="/store/storesettings"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <Settings className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Settings</span>
            </Link>
          </nav>
          
          <div className="mt-auto space-y-2">
            <Button
              onClick={handleOpenDialog}
              className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-800 text-red-400 hover:text-red-300 ${
                isSidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header
            className={`bg-white shadow-md fixed top-0 h-16 flex items-center justify-between z-40 transition-all duration-300 ${
              isSidebarOpen ? "left-64" : "left-20"
            }`}
            style={{
              width: isSidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)',
              padding: '0 1.5rem'
            }}
          >
            <h1 className="text-lg font-semibold text-gray-800">Store Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              {/* Notification Button with Badge */}
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate("/store/orders")}
              >
                <BellRing className="w-5 h-5 text-gray-700" />
                
                {/* Notification Count Badge */}
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>
              
              {/* Home Button */}
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => navigate("/")}
              >
                <Home className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </header>
          
          {/* Content Area */}
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