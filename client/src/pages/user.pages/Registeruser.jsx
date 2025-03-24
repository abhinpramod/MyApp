import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { HomeIcon } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP input state
  const [showOtpModal, setShowOtpModal] = useState(false); // Controls OTP modal visibility
  const [registrationData, setRegistrationData] = useState(null); // Stores registration data for OTP verification
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form inputs
  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required";
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";
    tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
    tempErrors.confirmPassword = formData.confirmPassword === formData.password ? "" : "Passwords must match";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Handle registration
  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/user/register", data);
      if (res.status === 200) {
        toast.success(res.data.msg || "OTP sent to your email");
        setRegistrationData(data); // Save registration data for OTP verification
        setShowOtpModal(true); // Show OTP modal
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.msg || "Failed to register");
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    const otpValue = otp.join("");
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        ...registrationData,
        otp: otpValue,
      });
      if (res.status === 200) {
        toast.success("Registration successful!");
        navigate("/loginuser");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const uniqueId = uuid().slice(2, 8);
      const finalData = { ...formData, uniqueId };
      register(finalData);
    }
  };

  // Handle OTP input change
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

  // Handle home button click
  const handleHomeClick = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: 10,
          marginTop: 10,
          position: "relative", // Add relative positioning to the Paper
        }}
      >
        {/* Home Icon Button inside Paper */}
        <Box
          sx={{
            position: "absolute",
            top: 16, // Adjust top position
            right: 16, // Adjust right position
          }}
        >
          <IconButton onClick={handleHomeClick} color="primary">
            <HomeIcon fontSize="large" />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {/* Left Side Image with Text Overlay */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "relative",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              height: "500px", // Adjust height as needed
            }}
          >
            <img
              src="../../../public/coverpic register.jpeg" // Replace with your image path
              alt="image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="body1">
              Join now to hire experts, find trusted stores, and build with confidence              </Typography>
            </Box>
          </Grid>

          {/* Right Side Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
              />
              <Box textAlign="center" marginTop={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create an Account
                </Button>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Typography variant="body2">
                  Already have an account? <Link to="/loginuser">Sign in</Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>

      {/* OTP Verification Modal */}
      <Modal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
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
            <Typography variant="h6" align="center" gutterBottom>
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
                />
              ))}
            </Box>
            <Box textAlign="center" marginTop={2}>
              <Button variant="contained" color="primary" onClick={verifyOtp}>
                Verify OTP
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}