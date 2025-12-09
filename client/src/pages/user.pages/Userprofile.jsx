import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Camera, Mail, User, Info, LogOut, ShoppingCart, ListChecks } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import Card from "../../components/ui/card";
import CardContent from "../../components/ui/card-content";
import Navbar from "../../components/Navbar";
import { logoutuser, loginuser } from "../../redux/userslice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Default avatar image URL (assuming this path is correct relative to the component's output)
const DEFAULT_AVATAR = "/avatar.png"; 

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Handlers for Menu and Dialog ---
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // --- Fetch User Data ---
  const fetchUser = async () => {
    try {
      setLoading(true); // Ensure loading is true before fetch
      const response = await axiosInstance.get("/user/check");
      const userData = response.data;
      
      // Update state with fetched data
      setUser(userData);
      
      // Dispatch Redux action
      dispatch(loginuser(userData));
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage = error.response?.data?.msg || "Failed to fetch user data";
      toast.error(errorMessage);
      
      // Log out user if token is invalid or unauthorized (e.g., status 403)
      if (error.response?.status === 403 || error.response?.status === 401) {
        dispatch(logoutuser());
        navigate("/login"); // Redirect to login page
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it runs only once on mount

  // --- Image Upload Handler ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setUploading(true);
    try {
      const response = await axiosInstance.put(
        "/user/uploadprofile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Optimistically update the user state with the new profile picture URL
      setUser((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      toast.success("Profile picture updated successfully!");
      
      // Re-fetch user to ensure Redux state is also updated with the new profile image URL
      fetchUser(); 
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage = error.response?.data?.msg || "Failed to update profile picture";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // --- Logout Handler ---
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/logout");
      dispatch(logoutuser());
      toast.success(response.data?.msg || "Logged out successfully!");
      navigate("/"); // Navigate to home or login page after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response?.data?.msg || "Failed to log out");
    } finally {
      handleCloseDialog();
    }
  };

  // --- Navigation Handlers ---
  const handleAccountInfo = () => {
    navigate("/InterestSentHistory"); // Assuming this is for history/account details
    handleMenuClose();
  };

  const handleshowcart = () => {
    navigate("/Cart");
    handleMenuClose();
  };

  const handleshoworders = () => {
    navigate("/orders");
    handleMenuClose();
  };

  // --- Loading State Render ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress className="text-indigo-600" />
      </div>
    );
  }

  // Handle case where user data might be null after loading completes (e.g., failed to fetch and not redirected)
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't load your profile data. Please try logging in again.</p>
        <Button 
          variant="contained" 
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: 'rgb(79, 70, 229)',
            '&:hover': {
                backgroundColor: 'rgb(67, 56, 202)',
            }
          }}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="w-full shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <CardContent className="p-6 space-y-8">
              {/* Header with Info Button */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Profile 👋</h1>
                <div className="relative">
                  <IconButton
                    onClick={handleMenuClick}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                    aria-label="More account options"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Info className="w-5 h-5" />
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      style: {
                        boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)",
                        borderRadius: "12px",
                        minWidth: "180px", // Increased minWidth for better readability
                        padding: "4px 0", // Reduced padding
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                      },
                    }}
                    MenuListProps={{
                      style: {
                        padding: 0,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleAccountInfo}
                      sx={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                          color: "rgb(99, 102, 241)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <ListChecks className="w-4 h-4" /> {/* Changed SVG to Lucide icon for consistency */}
                        History/Account Details
                      </div>
                    </MenuItem>

                    <MenuItem
                      onClick={handleshowcart}
                      sx={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                          color: "rgb(99, 102, 241)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-4 h-4" /> {/* Changed SVG to Lucide icon for consistency */}
                        Cart
                      </div>
                    </MenuItem>

                    <MenuItem
                      onClick={handleshoworders}
                      sx={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                          color: "rgb(99, 102, 241)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="lucide lucide-package"
                        >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Orders
                      </div>
                    </MenuItem>

                    <div className="border-t border-gray-100 my-1"></div>

                    <MenuItem
                      onClick={handleOpenDialog}
                      sx={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        color: "rgb(239, 68, 68)",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.08)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4" /> {/* Changed SVG to Lucide icon for consistency */}
                        Logout
                      </div>
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="relative rounded-full overflow-hidden w-32 h-32 border-4 border-white shadow-lg bg-gray-200">
                    <img
                      src={user.profileImage || DEFAULT_AVATAR} // Using user.profilePicture and fallback
                      alt={`${user.name}'s Profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                         e.target.onerror = null; 
                         e.target.src = DEFAULT_AVATAR; // Fallback on error
                      }}
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <CircularProgress className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="upload-image"
                    className={`absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg ${
                      uploading
                        ? "animate-pulse pointer-events-none opacity-75"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      id="upload-image"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 italic">
                  {uploading
                    ? "Uploading your new photo..."
                    : "Click the camera to update your profile"}
                </p>
              </div>

              {/* User Details Section */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-semibold">
                    {user.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email Address</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-semibold">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="mt-6 bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-800 mb-4">
                  Account Overview
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-indigo-100">
                    <span className="text-gray-600">User ID</span>
                    <span className="font-mono text-gray-800 text-xs truncate max-w-[50%]">
                      {user._id} {/* Assuming _id is the User ID */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle id="logout-dialog-title" className="text-lg font-bold text-gray-800">
          Confirm Logout
        </DialogTitle>
        <DialogContent id="logout-dialog-description">
          <p className="text-gray-600">
            Are you sure you want to log out of your account?
          </p>
        </DialogContent>
        <DialogActions className="gap-2">
          <Button
            onClick={handleCloseDialog}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained" // Use MUI variant for better styling consistency
            sx={{
              backgroundColor: 'rgb(239, 68, 68)', // Tailwind red-500/600 equivalent
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgb(220, 38, 38)', // Darker red on hover
              },
            }}
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;