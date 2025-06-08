import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Camera, Mail, User, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from "../../lib/axios";
import Card from '../../components/ui/card';
import CardContent from '../../components/ui/card-content';
import Navbar from '../../components/Navbar';
import { logoutuser } from '../../redux/userslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginuser } from '../../redux/userslice';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("user/check");
      setUser(response.data);
      setLoading(false);
      dispatch(loginuser(response.data));
    } catch (error) {
      if(error.response.status===403){
        return toast.error(error.response.data.msg);
      }
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      const response = await axiosInstance.put("/user/uploadprofile", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      toast.success('Profile picture updated successfully!');
      fetchUser();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
      
      if(error.response.status===403){
        toast.error(error.response.data.msg);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      dispatch(logoutuser());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    } finally {
      handleCloseDialog();
    }
  };
  
  const handleAccountInfo = () => {
    navigate("/InterestSentHistory");
  };

  const handleshowcart = () => {
    navigate("/Cart");
  };

  const handleshoworders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress className="text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="w-full shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <CardContent className="p-6 space-y-8">
              {/* Header with Info Button */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <div className="relative">
                  <IconButton 
                    onClick={handleMenuClick}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </IconButton>
              <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleMenuClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{
    style: {
      boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
      borderRadius: '12px',
      minWidth: '120px',
      padding: '8px 0',
      border: '1px solid rgba(0, 0, 0, 0.05)',
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
      padding: '10px 16px',
      fontSize: '14px',
      color: 'text.secondary',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        color: 'rgb(99, 102, 241)',
      },
      '&:active': {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
      },
      transition: 'all 0.2s ease',
    }}
  >
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      History
    </div>
  </MenuItem>
  
  <MenuItem 
    onClick={handleshowcart}
    sx={{
      padding: '10px 16px',
      fontSize: '14px',
      color: 'text.secondary',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        color: 'rgb(99, 102, 241)',
      },
      '&:active': {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
      },
      transition: 'all 0.2s ease',
    }}
  >
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Cart
    </div>
  </MenuItem>
  
  <MenuItem 
    onClick={handleshoworders}
    sx={{
      padding: '10px 16px',
      fontSize: '14px',
      color: 'text.secondary',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        color: 'rgb(99, 102, 241)',
      },
      '&:active': {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
      },
      transition: 'all 0.2s ease',
    }}
  >
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      padding: '10px 16px',
      fontSize: '14px',
      color: 'rgb(239, 68, 68)',
      '&:hover': {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
      },
      '&:active': {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
      },
      transition: 'all 0.2s ease',
    }}
  >
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Logout
    </div>
  </MenuItem>
</Menu>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="relative rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={user?.profileImage || '../../../public/avatar.png'}
                      alt="Profile"
                      className="w-32 h-32 object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <CircularProgress className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="upload-image"
                    className={`absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-md ${
                      uploading ? "animate-pulse pointer-events-none opacity-75" : "group-hover:scale-110"
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
                  {uploading ? "Uploading your new photo..." : "Click the camera to update your profile"}
                </p>
              </div>

              {/* User Details Section */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                    {user?.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email Address</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                    {user?.email}
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="mt-6 bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-800 mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-indigo-100">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-800">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
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
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle className="text-lg font-semibold text-gray-800">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-600">Are you sure you want to log out of your account?</p>
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
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
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