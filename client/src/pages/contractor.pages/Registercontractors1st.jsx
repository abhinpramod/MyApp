// RegisterContractorStep1.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { Country, State, City } from "country-state-city";
import Navbar from "../../components/Register/Registernav";
import FormFields from "../../components/Register/Registerformfields";
import OTPModal from "../../components/Register/Otpmodal";
import RightSection from "../../components/Register/Rightsidesection";

export default function RegisterContractorStep1() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [form, setForm] = useState({
    companyName: "",
    contractorName: "",
    email: "",
    phone: "",
    jobTypes: [],
    numberOfEmployees: "",
    password: "",
    confirmPassword: "",
    uuid: uuid().slice(2, 8),
    country: { code: "", name: "" },
    state: { code: "", name: "" },
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (form.country.code) {
      setStates(State.getStatesOfCountry(form.country.code));
    }
  }, [form.country.code]);

  useEffect(() => {
    if (form.state.code) {
      setCities(City.getCitiesOfState(form.country.code, form.state.code));
    }
  }, [form.state.code]);

  const validate = () => {
    const tempErrors = {};
    let isValid = true;

    const requiredFields = [
      "companyName",
      "contractorName",
      "email",
      "phone",
      "jobTypes",
      "numberOfEmployees",
      "password",
      "confirmPassword",
      "country",
      "state",
      "city",
    ];

    requiredFields.forEach((field) => {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
        tempErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = "Valid Email is required";
      isValid = false;
    }

    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      tempErrors.phone = "Phone Number must be 10 digits";
      isValid = false;
    }

    if (form.password && form.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (form.confirmPassword !== form.password) {
      tempErrors.confirmPassword = "Passwords must match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleJobTypesChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      jobTypes: value,
    }));
    if (errors.jobTypes) {
      setErrors(prev => ({ ...prev, jobTypes: undefined }));
    }
  };

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await axiosInstance.get("/contractor/jobtypes");
        setJobTypes(response.data);
      } catch (error) {
        console.error("Error fetching job types:", error);
        // Fallback to default job types if API fails
        setJobTypes(["plumbing", "electrical", "carpentry", "painting"]);
      }
    };
    fetchJobTypes();
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = Country.getAllCountries().find((c) => c.isoCode === countryCode);
    setForm((prev) => ({
      ...prev,
      country: { code: countryCode, name: selectedCountry.name },
      state: { code: "", name: "" },
      city: "",
    }));
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: undefined }));
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === stateCode);
    setForm((prev) => ({
      ...prev,
      state: { code: stateCode, name: selectedState.name },
      city: "",
    }));
    if (errors.state) {
      setErrors(prev => ({ ...prev, state: undefined }));
    }
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      city: e.target.value,
    }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Show first error as toast
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        toast.error(errors[firstErrorKey]);
      }
      return;
    }

    try {
      const payload = {
        ...form,
        country: form.country.name,
        state: form.state.name,
        city: form.city,
      };
      const res = await axiosInstance.post("/contractor/register1ststep", payload);
      if (res.status === 200) {
        toast.success(res.data.msg);
        setRegistrationData(payload);
        setShowOtpModal(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = error.response?.data?.msg || "Failed to register contractor";
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    }
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

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    try {
      const res = await axiosInstance.post("/contractor/verify-otp", {
        ...registrationData,
        otp: otpValue,
      });
      if (res.status === 200) {
        toast.success("Registration successful! Wait for admin approval.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar type={'contractor'} login={'register'} />
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        bgcolor: "#e5e7eb",
        padding: { xs: "16px", md: "0" }
      }}>
        <Grid container sx={{ 
          maxWidth: "lg", 
          width: "100%", 
          height: "100%",
          borderRadius: { xs: 0, md: 2 },
          overflow: "hidden",
          boxShadow: { xs: "none", md: 3 }
        }}>
          <Grid item xs={12} md={6} sx={{ 
            p: { xs: 2, md: 4 },
            bgcolor: "background.paper"
          }}>
            <FormFields 
              form={form} 
              errors={errors} 
              handleChange={handleChange} 
              handleJobTypesChange={handleJobTypesChange} 
              jobTypes={jobTypes} 
              states={states} 
              cities={cities} 
              handleCountryChange={handleCountryChange} 
              handleStateChange={handleStateChange} 
              handleCityChange={handleCityChange} 
            />
            <Button 
              fullWidth
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ 
                mt: 2, 
                mb: 2,
                borderRadius: "8px", 
                background: "#4f46e5", 
                "&:hover": { background: "#4338ca" },
                height: "48px"
              }} 
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Box sx={{ textAlign: "center", display: { xs: "block", md: "none" } }}>
              <a href="/contractor/Logincontractors" className="text-gray-700 text-sm hover:underline">
                Already have an account? Login
              </a>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ 
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            bgcolor: "#f9fafb"
          }}>
            <RightSection />
          </Grid>
        </Grid>
        <OTPModal
          showOtpModal={showOtpModal}
          setShowOtpModal={setShowOtpModal}
          otp={otp}
          handleOtpChange={handleOtpChange}
          handleOtpKeyDown={handleOtpKeyDown}
          verifyOtp={verifyOtp}
        />
      </Box>
    </motion.div>
  );
}