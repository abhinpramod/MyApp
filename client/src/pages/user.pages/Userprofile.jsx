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
  
//  const {user} = useSelector((state) => state.user);

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
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center mt-16 p-4">
        <Card className="max-w-2xl w-full shadow-xl rounded-lg overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Info Button */}
            <div className="flex justify-end">
              <IconButton onClick={handleMenuClick}>
                <Info />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleAccountInfo}>History</MenuItem>
                <MenuItem onClick={handleshowcart}>cart</MenuItem>
                <MenuItem onClick={handleOpenDialog}>Logout</MenuItem>
                <MenuItem onClick={handleshoworders}>orders</MenuItem>
              </Menu>
            </div>

            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={user?.profileImage || '../../../public/avatar.png'}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-2 "
                />
                <label
                  htmlFor="upload-image"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${uploading ? "animate-pulse pointer-events-none" : ""}`}
                >
                  <Camera className="w-5 h-5 text-base-200" />
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
              <p className="text-sm text-zinc-400">
                {uploading ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* User Details Section */}
            <div className="space-y-4">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{user?.name}</p>

              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{user?.email}</p>
            </div>

            {/* Account Information Section */}
            <div className="mt-6 bg-base-300 rounded-xl p-4">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to log out?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;