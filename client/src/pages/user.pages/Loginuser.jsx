import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginuser } from "../../redux/userslice";
import { logoutcontractor } from "../../redux/contractorslice";
import LoginFormUI from "@/components/LoginFormUI";
import ForgotPassword from "../../components/forgotpassword";

const UserLoginPage = () => {
      const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const validate = () => {
    let tempErrors = {};
  
    // Email validation
    const trimmedEmail = formData.email.trim(); // Trim the email input
    if (!trimmedEmail) {
      tempErrors.email = "Email is required"; // Show this error if email is empty
    } else if (!/.+@.+\..+/.test(trimmedEmail)) {
      tempErrors.email = "Invalid email format"; // Show this error if email format is invalid
    } else {
      tempErrors.email = ""; // No error if email is valid
    }
  
    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required"; // Show this error if password is empty
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long"; // Show this error if password is too short
    } else {
      tempErrors.password = ""; // No error if password is valid
    }
  
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === ""); // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axiosInstance.post("/user/login", formData);
        if (res.status === 200) {
          toast.success("Login successful!");
          dispatch(loginuser(res.data));
          dispatch(logoutcontractor());
          navigate("/userprofile");
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.msg || "Login failed!");
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response from server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An error occurred. Please try again.");
        }
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigateRegister = () => {
    navigate("/registeruser");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
         {showForgotPassword ? (
        <ForgotPassword 
          userType="user" // or "user" or "store" based on your page
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      ) : (
      <LoginFormUI
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onNavigateRegister={handleNavigateRegister}
        logoText="LocalFinder"
        welcomeMessage="Login to find skilled labors and stores near you."
         currentUserType="user"
         welcomehead = "User Login"
         onForgotPassword={() => setShowForgotPassword(true)}
      />)}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="../../public/cover.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default UserLoginPage;