import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logincontractor } from "../../redux/contractorslice";
import LoginFormUI from "@/components/LoginFormUI";

const ContractorLoginPage = () => {
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
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      tempErrors.email = "Email is required";
    } else if (!/.+@.+\..+/.test(trimmedEmail)) {
      tempErrors.email = "Invalid email format";
    } else {
      tempErrors.email = "";
    }
  
    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
    } else {
      tempErrors.password = "";
    }
  
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axiosInstance.post("/contractor/login", formData);
        if (res.status === 200) {
          dispatch(logincontractor(res.data));
          if (res.data.verified && res.data.isBlocked === false) {
            navigate("/contractor/dashboard");
            toast.success("Login successful!");
          } else if (
            res.data.approvalStatus === "Approved" &&
            res.data.verified === false
          ) {
            navigate("/contractor/registercontractorstep2");
          } else if (res.data.approvalStatus === "Rejected") {
            toast.error("Your request is rejected.");
            navigate("/home");
          } else {
            toast.error("Your request is pending.");
            navigate("/home");
          }
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.msg || "Login failed!");
        } else if (error.request) {
          toast.error("No response from server. Please try again.");
        } else {
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
    navigate("/contractor/registercontractorstep1");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <LoginFormUI
        formData={formData}
        errors={errors}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onNavigateRegister={handleNavigateRegister}
        logoText="LocalFinder"
        welcomeMessage="Login to manage your contractor account."
         currentUserType="contractor"
         welcomehead="Contractor Login"
      />
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

export default ContractorLoginPage;