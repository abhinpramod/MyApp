import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  Link,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logincontractor } from "../../redux/contractorslice";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { isBlock } from "typescript";

const Logincontractors = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else {
      tempErrors.email = /.+@.+\..+/.test(formData.email)
        ? ""
        : "Invalid email format";
    }
    tempErrors.password = formData.password ? "" : "Password is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axiosInstance.post("/contractor/login", formData);
        console.log(res.data);

        if (res.status === 200) {
          
          // Dispatch the login action with the contractor data
          // res.data.verified&& res.data.approvalStatus
          //   ? navigate("/contractor/contractordashboard")
          //   : navigate("/contractor/registercontractorstep2");

          if ( res.data.verified && res.data.isBlocked===false  ) {
            navigate("/contractor/contractorhome");
            toast.success("Login successful!");
          dispatch(logincontractor(res.data));
          } else if( res.data.approvalStatus==="Approved"&&res.data.verified===false){
            dispatch(logincontractor(res.data));

            navigate("/contractor/registercontractorstep2");
          
          }else if( res.data.approvalStatus==="Rejected"){ 
           
          toast.error("Your request is rejected  .");
          navigate("/home");
          }else{
            navigate("/home");
            toast.success("your request is pending");
            
          }
        }
      } catch (error) {
        console.log(error);

        toast.error(error.response.data.msg || "Login failed!");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <IconButton onClick={handleHomeClick} color="">
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
              src="../../../public/cover.jpeg"
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
                Welcome Back!
              </Typography>
              <Typography variant="body1">
                Login to access your contractor account and manage your
                projects.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              Login contractor
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
              <Box textAlign="center" marginTop={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link href="/contractor/registercontractorstep1">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Logincontractors;
