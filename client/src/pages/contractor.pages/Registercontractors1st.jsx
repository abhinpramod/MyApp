import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const jobTypes = ["plumbing","electrical", "carpentry", "painting"];
 

export default function RegisterContractorStep1() {
  const navigate = useNavigate();
  const login=false
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
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = "Valid Email is required";
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      tempErrors.phone = "Phone Number must be 10 digits";
    }
    if (form.password && form.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (form.confirmPassword !== form.password) {
      tempErrors.confirmPassword = "Passwords must match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobTypesChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      jobTypes: value,
    }));
  };

  useEffect(() => {
    console.log('jobTypes');
    
  const  fectchjobtypes = async () => {
    try {
      const response = await axiosInstance.get("/contractor/jobtypes");
      setJobTypes(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  }
  console.log(jobTypes);
  fectchjobtypes();
      
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
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === stateCode);
    setForm((prev) => ({
      ...prev,
      state: { code: stateCode, name: selectedState.name },
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(error.response?.data?.msg || "Failed to register contractor");
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
    try {
      const res = await axiosInstance.post("/contractor/verify-otp", {
        ...registrationData,
        otp: otpValue,
      });
      if (res.status === 200) {
        toast.success("Registration successful! Wait for admin approval.");
        navigate("/contractors");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar login={false} />
      <Box  sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#e5e7eb"   }}>
        <Grid className="oklch(0.278 0.033 256.848)" container sx={{ maxWidth: "screen", width: "100%",   display: "flex", height: "100%" }}>
          <Grid margin={1} item xs={12} md={6} sx={{ p: 4 }}>
            <FormFields form={form} errors={errors} handleChange={handleChange} handleJobTypesChange={handleJobTypesChange} jobTypes={jobTypes} states={states} cities={cities} handleCountryChange={handleCountryChange} handleStateChange={handleStateChange} handleCityChange={handleCityChange} />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2, borderRadius: "8px", background: "#4f46e5", "&:hover": { background: "#4338ca" } }} onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid item md={0.03} sx={{ display: { xs: "none", md: "block" }, bgcolor: "#e5e7eb" }}></Grid>
          <Grid className="bg-oklch(0.278 0.033 256.848)" item xs={12} md={5.8} sx={{ display: { xs: "none", md: "block" },  p: 4 }}>
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
