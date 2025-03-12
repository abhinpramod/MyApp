import React, { useState, useEffect } from "react";
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

const jobTypes = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
];

export default function RegisterContractorStep1() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({});
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar />
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc" }}>
        <Grid container sx={{ maxWidth: "screen", width: "100%", bgcolor: "white",  display: "flex", height: "100%" }}>
          <Grid margin={1} item xs={12} md={6} sx={{ p: 4 }}>
            <FormFields form={form} errors={errors} handleChange={handleChange} handleJobTypesChange={handleJobTypesChange} jobTypes={jobTypes} states={states} cities={cities} handleCountryChange={handleCountryChange} handleStateChange={handleStateChange} handleCityChange={handleCityChange} />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2, borderRadius: "8px", background: "#4f46e5", "&:hover": { background: "#4338ca" } }} onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid item md={0.03} sx={{ display: { xs: "none", md: "block" }, bgcolor: "#e5e7eb" }}></Grid>
          <Grid item xs={12} md={5.8} sx={{ display: { xs: "none", md: "block" }, bgcolor: "white", p: 4 }}>
            <RightSection />
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
