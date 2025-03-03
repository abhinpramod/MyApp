import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Box, Grid, Link } from "@mui/material";
import { useDispatch } from "react-redux";
import { logincontractor } from "../redux/contractorslice"; 
import axiosInstance from "../lib/axios"; 
import { toast } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom"; 

export default function Logincontractors() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";
    tempErrors.password = formData.password ? "" : "Password is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axiosInstance.post("/contractor/login", formData);
        if (res.status === 200) {
          toast.success("Login successful!");
          dispatch(logincontractor(res.data)); // Dispatch the login action with the contractor data
          res.data.verified ? navigate("/dashboard") : navigate("/contractorregisterstep2");
        } else {
          toast.error("Login failed!");
        }
      } catch (error) {
        toast.error("Login failed!");
        console.error("Login error:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 10, marginTop: 15 }}>
        <Grid container spacing={2}>
          {/* Left Side Image (Only visible on large screens) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
            <img src="/abstract-lines.svg" alt="image" style={{ maxWidth: "80%" }} />
          </Grid>

          {/* Right Side Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              Login to Your Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin="normal" />
              <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} margin="normal" />
              <Box textAlign="right" marginTop={1}>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Login
                </Button>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Typography variant="body2">
                  Don't have an account? <Link href="/registercontractors1">Sign up</Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}