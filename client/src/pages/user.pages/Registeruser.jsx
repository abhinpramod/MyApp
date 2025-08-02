import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { 
  Modal, 
  Backdrop, 
  Fade, 
  Typography, 
  Box, 
  Button, 
  TextField 
} from "@mui/material";

const OTPModal = ({ 
  showOtpModal, 
  setShowOtpModal, 
  otp, 
  handleOtpChange, 
  handleOtpKeyDown, 
  verifyOtp 
}) => {
  return (
    <Modal
      open={showOtpModal}
      onClose={() => setShowOtpModal(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      role="dialog"
      aria-labelledby="modal-title"
    >
      <Fade in={showOtpModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom id="modal-title">
            Enter OTP
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputProps={{ maxLength: 1 }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                sx={{ width: "40px", textAlign: "center" }}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </Box>
          <Box textAlign="center" marginTop={2}>
            <Button 
              variant="contained" 
              sx={{backgroundColor: "black", opacity: 0.9}}  
              onClick={verifyOtp}
            >
              Verify OTP
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required";
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else {
      tempErrors.phone = /^[0-9]{10,15}$/.test(formData.phone) ? "" : "Invalid phone number (10-15 digits)";
    }
    tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
    tempErrors.confirmPassword = formData.confirmPassword === formData.password ? "" : "Passwords must match";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/user/register", data);
      if (res.status === 200) {
        toast.success(res.data.msg || "OTP sent to your email");
        setRegistrationData(data);
        setShowOtpModal(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.msg || "Failed to register");
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        ...registrationData,
        otp: otpValue,
      });
      if (res.status === 200) {
        toast.success("Registration successful!");
        navigate("/loginuser");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const uniqueId = uuid().slice(2, 8);
      const finalData = { ...formData, uniqueId };
      register(finalData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleNavigateLogin = () => {
    navigate("/loginuser");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join now to hire experts, find trusted stores, and build with confidence
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter 10-15 digit phone number"
                maxLength={15}
                required
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full rounded-md bg-black p-2 text-white hover:bg-gray-800"
            >
              Create an Account
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button 
              onClick={handleNavigateLogin} 
              className="text-black underline hover:text-gray-700"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
<img src="/coverpic register.jpeg" 
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Welcome!</h2>
            <p className="mt-4 text-xl">
              Join now to hire experts, find trusted stores, and build with confidence
            </p>
          </div>
        </div>
      </div>

      <OTPModal
        showOtpModal={showOtpModal}
        setShowOtpModal={setShowOtpModal}
        otp={otp}
        handleOtpChange={handleOtpChange}
        handleOtpKeyDown={handleOtpKeyDown}
        verifyOtp={verifyOtp}
      />
      
    </div>
  );
}