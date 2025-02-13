import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required";
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";
    tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
    tempErrors.confirmPassword = formData.confirmPassword === formData.password ? "" : "Passwords must match";
    
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };
  const register = (data) => {
    console.log("Registration Data:", data);
    const res=axiosInstance.post("/user/register", data);
    console.log("Registration Response:", res);
    if (res.status === 200) {
      console.log("Registration successful!");
      toast.success("Registration successful!");
    } else {
      console.log("Registration failed!");
      toast.error("Registration failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      register(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Grid container spacing={2}>
          {/* Left Side Image (Only visible on large screens) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
            <img src="/abstract-lines.svg" alt="Abstract Art" style={{ maxWidth: "80%" }} />
          </Grid>
          
          {/* Right Side Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} margin="normal" />
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin="normal" />
              <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} margin="normal" />
              <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} margin="normal" />
              <Box textAlign="center" marginTop={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create an Account
                </Button>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Typography variant="body2">
                  Already have an account? <Link to="/login">Sign in</Link>
                </Typography>
              </Box>
            
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
