import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  Home,
  Briefcase,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  MapPin,
  ArrowLeft,
  Loader,
  Upload,
  BellRing,
  BriefcaseBusiness,
} from "lucide-react";
import Button from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { logoutcontractor } from "../../redux/contractorslice";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { Badge } from "@/components/ui/badge";

const ContractorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout dialog
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/contractor/logout");
      dispatch(logoutcontractor());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    } finally {
      handleCloseDialog();
    }
  };

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        setLoadingNotifications(true);
        const response = await axiosInstance.get("/contractor/notifications");
        setNotificationCount(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
        setNotificationCount(2);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotificationCount();
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotificationCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
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
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          } ${isMobile ? "z-50" : ""}`}
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none self-end"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Navigation Links */}
          <nav className="space-y-4 mt-4 flex-1">
            <Link
              to="/contractor/dashboard"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <LayoutDashboard />{" "}
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Dashboard
              </span>
            </Link>
            <Link
              to="/contractor/ContractorProfile"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <User className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Profile
              </span>
            </Link>
            <Link
              to="/contractor/notifications"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <BellRing className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Notifications
              </span>
              {notificationCount > 0 && (
                <span className={`ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                  isSidebarOpen ? "block" : "hidden"
                }`}>
                  {notificationCount}
                </span>
              )}
            </Link>
            <Link
              to="/contractor/project"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <BriefcaseBusiness className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Projects
              </span>
            </Link>
            <Link
              to="/contractor/settings"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800`}
            >
              <Settings className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Settings
              </span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <Button
              onClick={handleOpenDialog}
              variant="ghost"
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-gray-800 text-red-400 hover:text-red-300`}
            >
              <LogOut className="w-5 h-5" />
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Logout
              </span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header
            className={`bg-white shadow-md w-full fixed top-0 h-16 flex items-center px-6 justify-between z-40 transition-all duration-300 ${
              isSidebarOpen ? "left-64" : "left-20"
            }`}
            style={{
              width: isSidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)'
            }}
          >
            <h1 className="text-lg font-semibold text-gray-800">
              Contractor Dashboard
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Notification Button with Badge */}
              <button
  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
  onClick={() => navigate("/contractor/notifications")}
>
  <Bell className="w-6 h-6 text-gray-700" />
  
  {/* Notification Count Badge */}
  {notificationCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
      {notificationCount > 9 ? "9+" : notificationCount}
    </span>
  )}

  {/* Loader Badge while loading */}
  {loadingNotifications && notificationCount === 0 && (
    <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
      <Loader className="w-3 h-3 animate-spin" />
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

          {/* Page Content */}
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

export default ContractorDashboard;