import React, { useState } from 'react';
import { TextField, Button, IconButton } from '@mui/material';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logincontractor } from '../../redux/contractorslice';
import axiosInstance from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Register/Registernav';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else {
      tempErrors.email = /.+@.+\..+/.test(formData.email) ? '' : 'Invalid email format';
    }
    tempErrors.password = formData.password ? '' : 'Password is required';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axiosInstance.post('/contractor/login', formData);
        if (res.status === 200) {
          dispatch(logincontractor(res.data));
          if (res.data.verified && res.data.isBlocked === false) {
            navigate('/contractor/dashboard');
            toast.success('Login successful!');
          } else if (res.data.approvalStatus === 'Approved' && res.data.verified === false) {
            navigate('/contractor/registercontractorstep2');
          } else if (res.data.approvalStatus === 'Rejected') {
            toast.error('Your request is rejected.');
            navigate('/home');
          } else {
            toast.error('Your request is pending.');
            navigate('/home');
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Login failed!');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar login={'login'} />

      {/* Body Section (Takes Remaining Height) */}
      <div className="flex flex-grow">
        {/* Left Section (Form) */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6   bg-gray-100 sm:p-12">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Log in</h1>

          <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <TextField
              fullWidth
              label="Email address"
              variant="outlined"
              size="small"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            
              InputProps={{ style: { borderRadius: '20px', padding: '8px' } }}
            />

            {/* Password Input */}
            <div className="relative">
              <TextField
                fullWidth
                size="small"
                label="Password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{ style: { borderRadius: '20px', padding: '8px' } }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              
              sx={{ mt: 2, borderRadius: '20px', padding: '10px 0', bgcolor:'oklch(0.577 0.245 27.325)'}}
            >
              Log in
            </Button>
          </form>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Can't Log in?
            </a>
          </div>

          <p className="mt-4 text-xs text-center text-gray-400">
            Secure login with reCAPTCHA subject to Google Terms & Privacy
          </p>

          <div className="mt-6 sm:hidden text-center">
            <a href="/contractor/registercontractorstep1" className="text-gray-700 text-sm hover:underline">
              Create an account
            </a>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:flex w-1/2 items-center justify-center ">
          <div className="w-2/3 h-2/3  ">
          <img src="../../../public/login.image.png" alt="iamge" />
          </div>
        </div>
      </div>
    </div>
  );
}
