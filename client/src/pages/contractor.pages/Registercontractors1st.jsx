import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Backdrop,
  Fade,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { Country, State, City } from "country-state-city";

const jobTypes = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "carpentry", label: "Carpentry" },
  { value: "painting", label: "Painting" },
];

export default function RegisterContractorStep1() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP input state
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
    country: { code: "", name: "" }, // Store both code and name
    state: { code: "", name: "" },   // Store both code and name
    city: "",                        // City name remains the same
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch states when country changes
  useEffect(() => {
    if (form.country.code) {
      setStates(State.getStatesOfCountry(form.country.code));
    }
  }, [form.country.code]);

  // Fetch cities when state changes
  useEffect(() => {
    if (form.state.code) {
      setCities(City.getCitiesOfState(form.country.code, form.state.code));
    }
  }, [form.state.code]);

  // Validate form fields
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

  // Handle form field changes
  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle job types change
  const handleJobTypesChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      jobTypes: value,
    }));
  };

  // Handle country change
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

  // Handle state change
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === stateCode);
    setForm((prev) => ({
      ...prev,
      state: { code: stateCode, name: selectedState.name },
      city: "",
    }));
  };

  // Handle city change
  const handleCityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const payload = {
          ...form,
          country: form.country.name, // Send the country name
          state: form.state.name,     // Send the state name
          city: form.city,            // Send the city name
        };
        const res = await axiosInstance.post("/contractor/register1ststep", payload);
        if (res.status === 200) {
          toast.success(res.data.msg);
          setRegistrationData(payload); // Save registration data for OTP verification
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

  // Handle OTP change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle backspace in OTP input
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpValue = otp.join("");
    try {
      const res = await axiosInstance.post("/contractor/verify-otp", {
        ...registrationData,
        otp: otpValue,
      });
      if (res.status === 200) {
        toast.success("Registration successful wait for admin approval!");
        navigate("/contractors");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "#f0f4f8",
          overflowY: "auto",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            maxWidth: 1000,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Registration Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flex: 1,
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Side - Form Fields */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  Register Contractor
                </Typography>
                <IconButton onClick={() => navigate("/")} aria-label="Home">
                  <Home size={24} />
                </IconButton>
              </Box>

              {/* Form Fields */}
              {[
                "companyName",
                "contractorName",
                "email",
                "phone",
                "numberOfEmployees",
              ].map((field) => (
                <Box key={field} sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                  <input
                    type="text"
                    name={field}
                    id={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="peer"
                    placeholder=" "
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      fontSize: "16px",
                      outline: "none",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    aria-invalid={!!errors[field]}
                    aria-required="true"
                    aria-describedby={`${field}-error`}
                  />
                  <label
                    htmlFor={field}
                    style={{
                      position: "absolute",
                      left: "0",
                      top: form[field] ? "-12px" : "8px",
                      fontSize: form[field] ? "12px" : "16px",
                      color: form[field] ? "#1976d2" : "#666",
                      transition: "all 0.3s ease",
                      pointerEvents: "none",
                    }}
                  >
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {errors[field] && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }} id={`${field}-error`}>
                      {errors[field]}
                    </Typography>
                  )}
                </Box>
              ))}

              {/* Job Types Dropdown */}
              <Box sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                <FormControl fullWidth>
                  <InputLabel id="jobTypes-label">Job Types</InputLabel>
                  <Select
                    labelId="jobTypes-label"
                    name="jobTypes"
                    value={form.jobTypes}
                    onChange={handleJobTypesChange}
                    multiple
                    fullWidth
                    sx={{ padding: "8px 0", fontSize: "16px", outline: "none", border: "none" }}
                    aria-invalid={!!errors.jobTypes}
                    aria-required="true"
                    aria-describedby="jobTypes-error"
                  >
                    {jobTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.jobTypes && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }} id="jobTypes-error">
                    {errors.jobTypes}
                  </Typography>
                )}
              </Box>

              {/* Password Fields */}
              {["password", "confirmPassword"].map((field) => (
                <Box key={field} sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                  <input
                    type="password"
                    name={field}
                    id={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="peer"
                    placeholder=" "
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      fontSize: "16px",
                      outline: "none",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    aria-invalid={!!errors[field]}
                    aria-required="true"
                    aria-describedby={`${field}-error`}
                  />
                  <label
                    htmlFor={field}
                    style={{
                      position: "absolute",
                      left: "0",
                      top: form[field] ? "-12px" : "8px",
                      fontSize: form[field] ? "12px" : "16px",
                      color: form[field] ? "#1976d2" : "#666",
                      transition: "all 0.3s ease",
                      pointerEvents: "none",
                    }}
                  >
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {errors[field] && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }} id={`${field}-error`}>
                      {errors[field]}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Right Side - Location Details */}
            <Box sx={{ flex: 1, bgcolor: "#1e293b", p: 4, borderRadius: 0, color: "white" }}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
                Location Details
              </Typography>

              {/* Country Dropdown */}
              <Box sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                <FormControl fullWidth>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    name="country"
                    value={form.country.code}
                    onChange={handleCountryChange}
                    fullWidth
                    sx={{ padding: "8px 0", fontSize: "16px", outline: "none", border: "none", color: "white" }}
                    aria-invalid={!!errors.country}
                    aria-required="true"
                    aria-describedby="country-error"
                  >
                    {Country.getAllCountries().map((country) => (
                      <MenuItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.country && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }} id="country-error">
                    {errors.country}
                  </Typography>
                )}
              </Box>

              {/* State Dropdown */}
              <Box sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                <FormControl fullWidth>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    name="state"
                    value={form.state.code}
                    onChange={handleStateChange}
                    disabled={!form.country.code}
                    fullWidth
                    sx={{ padding: "8px 0", fontSize: "16px", outline: "none", border: "none", color: "white" }}
                    aria-invalid={!!errors.state}
                    aria-required="true"
                    aria-describedby="state-error"
                  >
                    {states.map((state) => (
                      <MenuItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.state && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }} id="state-error">
                    {errors.state}
                  </Typography>
                )}
              </Box>

              {/* City Dropdown */}
              <Box sx={{ position: "relative", borderBottom: "2px solid #ccc" }}>
                <FormControl fullWidth>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    name="city"
                    value={form.city}
                    onChange={handleCityChange}
                    disabled={!form.state.code}
                    fullWidth
                    sx={{ padding: "8px 0", fontSize: "16px", outline: "none", border: "none", color: "white" }}
                    aria-invalid={!!errors.city}
                    aria-required="true"
                    aria-describedby="city-error"
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.city && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }} id="city-error">
                    {errors.city}
                  </Typography>
                )}
              </Box>

              {/* Additional Text */}
              <Typography variant="body1" sx={{ mt: 2, color: "#ccc" }}>
                Please ensure all details are accurate. This information will be used for verification purposes. After submission, your registration will be reviewed by the admin team. You will receive a confirmation email once approved. If you have any questions, feel free to contact our support team at{" "}
                <strong>support@contractor.com</strong>.
              </Typography>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  width: "100%",
                  py: 1.5,
                }}
                aria-label="Submit registration form"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* OTP Modal */}
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
              <Button variant="contained" color="primary" onClick={verifyOtp} aria-label="Verify OTP">
                Verify OTP
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </motion.div>
  );
}