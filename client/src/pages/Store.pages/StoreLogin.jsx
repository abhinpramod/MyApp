import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginstore } from "../../redux/storeslice";
import LoginFormUI from "@/components/LoginFormUI"; 
import { Loader } from "lucide-react";
import ForgotPassword from "../../components/forgotpassword";

const storeLoginPage = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
      
      try {
        const res = await axiosInstance.post("/store/login", formData);
        if (res.status ===400) {
          toast.success(res.data.msg || "invalid credentials!");
          navigate("/");
          setLoading(false);

        }
  
        if (res.status === 200) {
          toast.success(res.data.msg || "Login successful!");
          navigate("/");
          dispatch(loginstore(res.data));
          setLoading(false);
        }

        if (res.status === 403) {
          toast.error(res.data.msg);
        
        
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response) {
          
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
    navigate("/storeregistration");
  };

  if (loading) return <div className="flex items-center justify-center h-screen">
  <Loader className="size-10 animate-spin" />
</div>;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
         {showForgotPassword ? (
        <ForgotPassword 
          userType="store" // or "user" or "store" based on your page
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
        welcomeMessage="Login to LocalFinder and sell your products"
         currentUserType="store"
         welcomehead="Store Login"
         onForgotPassword={() => setShowForgotPassword(true)}
      />)}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/cover.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default storeLoginPage;