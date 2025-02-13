import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Box, Grid, Link } from "@mui/material";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";
    tempErrors.password = formData.password ? "" : "Password is required";
    
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login Data:", formData);
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
            <img src="/abstract-lines.svg" alt="Abstract Art" style={{ maxWidth: "80%" }} />
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
                  Don't have an account? <Link href="/register">Sign up</Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
