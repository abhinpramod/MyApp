import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";

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
    location: "",
    email: "",
    phone: "",
    jobTypes: [],
    numberOfEmployees: "",
    password: "",
    confirmPassword: "",
    uuid: uuid().slice(2, 8),
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    const requiredFields = [
      "companyName", "contractorName", "location", "email", "phone", "numberOfEmployees", "password", "confirmPassword",
    ];
    requiredFields.forEach((field) => {
      if (!form[field]) tempErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
    });
    if (form.jobTypes.length === 0) tempErrors.jobTypes = "At least one job type is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) tempErrors.email = "Valid Email is required";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) tempErrors.phone = "Phone Number must be 10 digits";
    if (form.employees && (isNaN(form.employees) || form.employees <= 1)) tempErrors.employees = "More than 1 employee required";
    if (form.password && form.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) tempErrors.confirmPassword = "Passwords must match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "jobTypes" ? value : value,
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
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2, bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", overflowY: "auto" }}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 6, width: "100%", maxWidth: 600 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" color="">Register Contractor</Typography>
            <IconButton color="" onClick={() => navigate("/")}><Home size={24} /></IconButton>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["companyName", "contractorName", "location", "email", "phone", "numberOfEmployees"].map((field) => (
              <TextField key={field} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} name={field} value={form[field]} onChange={handleChange} error={!!errors[field]} helperText={errors[field]} fullWidth />
            ))}
            <TextField select label="Job Types" name="jobTypes" value={form.jobTypes} onChange={handleChange} error={!!errors.jobTypes} helperText={errors.jobTypes} fullWidth SelectProps={{ multiple: true }}>
              {jobTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} fullWidth />
            <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} fullWidth />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2, borderRadius: 3 }}>Next</Button>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}
