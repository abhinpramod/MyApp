import React, { useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
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
    country: "",
    state: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const validate = () => {
    const tempErrors = {};
    const requiredFields = [
      "companyName", "contractorName", "email", "phone", "numberOfEmployees", "password", "confirmPassword", "country", "state", "city", "jobTypes",
    ];
    requiredFields.forEach((field) => {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
        tempErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) tempErrors.email = "Valid Email is required";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) tempErrors.phone = "Phone Number must be 10 digits";
    if (form.password && form.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) tempErrors.confirmPassword = "Passwords must match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
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
    setForm((prev) => ({
      ...prev,
      country: countryCode,
      state: "",
      city: "",
    }));
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setForm((prev) => ({
      ...prev,
      state: stateCode,
      city: "",
    }));
    setCities(City.getCitiesOfState(form.country, stateCode));
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
        const res = await axiosInstance.post("/contractor/register1ststep", form);
        if (res.status === 200) {
          toast.success("Registration successful! Wait for admin approval.");
          navigate("/");
        } else {
          toast.error();
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(error.response?.data?.msg || "Failed to add admin");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2, bgcolor: "#f0f4f8", overflowY: "auto" }}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 800, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Wrap the entire form in a <form> tag */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flex: 1, gap: 4, flexDirection: { xs: "column", md: "row" } }}>
            {/* Left Side - Registration Form */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">Register Contractor</Typography>
                <IconButton color="primary" onClick={() => navigate("/")}><Home size={24} /></IconButton>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Custom Input Fields with Floating Labels */}
                {["companyName", "contractorName", "email", "phone", "numberOfEmployees"].map((field) => (
                  <Box key={field} sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
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
                    />
                    <label
                      htmlFor={field}
                      style={{
                        position: "absolute",
                        left: "0",
                        top: form[field] ? "-12px" : "8px",
                        fontSize: form[field] ? "12px" : "16px",
                        color: form[field] ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    {errors[field] && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors[field]}
                      </Typography>
                    )}
                  </Box>
                ))}

                {/* Job Types Dropdown (Multiple Selection) */}
                <Box sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="jobTypes-label"
                      sx={{
                        position: "absolute",
                        left: "0",
                        top: form.jobTypes.length ? "-12px" : "8px",
                        fontSize: form.jobTypes.length ? "12px" : "16px",
                        color: form.jobTypes.length ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      Job Types
                    </InputLabel>
                    <Select
                      labelId="jobTypes-label"
                      name="jobTypes"
                      value={form.jobTypes}
                      onChange={handleJobTypesChange}
                      multiple
                      fullWidth
                      sx={{
                        padding: "8px 0",
                        fontSize: "16px",
                        outline: "none",
                        border: "none",
                        backgroundColor: "transparent",
                      }}
                    >
                      {jobTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.jobTypes && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.jobTypes}
                    </Typography>
                  )}
                </Box>

                {/* Password Fields */}
                {["password", "confirmPassword"].map((field) => (
                  <Box key={field} sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
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
                    />
                    <label
                      htmlFor={field}
                      style={{
                        position: "absolute",
                        left: "0",
                        top: form[field] ? "-12px" : "8px",
                        fontSize: form[field] ? "12px" : "16px",
                        color: form[field] ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    {errors[field] && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors[field]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right Side - Country, State, City Dropdowns, Text, and Submit Button */}
            <Box sx={{ flex: 1, bgcolor: "#1e293b", p: 4, borderRadius: 3, color: "white" }}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>Location Details</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Country Dropdown */}
                <Box sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="country-label"
                      sx={{
                        position: "absolute",
                        left: "0",
                        top: form.country ? "-12px" : "8px",
                        fontSize: form.country ? "12px" : "16px",
                        color: form.country ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      Country
                    </InputLabel>
                    <Select
                      labelId="country-label"
                      name="country"
                      value={form.country}
                      onChange={handleCountryChange}
                      fullWidth
                      sx={{
                        padding: "8px 0",
                        fontSize: "16px",
                        outline: "none",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      {Country.getAllCountries().map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.country && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.country}
                    </Typography>
                  )}
                </Box>

                {/* State Dropdown */}
                <Box sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="state-label"
                      sx={{
                        position: "absolute",
                        left: "0",
                        top: form.state ? "-12px" : "8px",
                        fontSize: form.state ? "12px" : "16px",
                        color: form.state ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      State
                    </InputLabel>
                    <Select
                      labelId="state-label"
                      name="state"
                      value={form.state}
                      onChange={handleStateChange}
                      disabled={!form.country}
                      fullWidth
                      sx={{
                        padding: "8px 0",
                        fontSize: "16px",
                        outline: "none",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.state && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.state}
                    </Typography>
                  )}
                </Box>

                {/* City Dropdown */}
                <Box sx={{ position: "relative", borderBottom: "2px solid #ccc", "&:focus-within": { borderBottomColor: "primary.main" } }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="city-label"
                      sx={{
                        position: "absolute",
                        left: "0",
                        top: form.city ? "-12px" : "8px",
                        fontSize: form.city ? "12px" : "16px",
                        color: form.city ? "primary.main" : "#666",
                        transition: "all 0.3s ease",
                        pointerEvents: "none",
                      }}
                    >
                      City
                    </InputLabel>
                    <Select
                      labelId="city-label"
                      name="city"
                      value={form.city}
                      onChange={handleCityChange}
                      disabled={!form.state}
                      fullWidth
                      sx={{
                        padding: "8px 0",
                        fontSize: "16px",
                        outline: "none",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.city && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.city}
                    </Typography>
                  )}
                </Box>

                {/* Additional Text */}
                <Typography variant="body1" sx={{ mt: 2, color: "#ccc" }}>
                  Please ensure all details are accurate. This information will be used for verification purposes. After submission, your registration will be reviewed by the admin team. You will receive a confirmation email once approved. If you have any questions, feel free to contact our support team at <strong>support@contractor.com</strong>.
                </Typography>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                    width: "100%",
                    py: 1.5,
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}