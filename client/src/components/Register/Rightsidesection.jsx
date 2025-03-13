import React from "react";
import { Box, Typography } from "@mui/material";

const RightSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Background Image */}
      <img
        src="../../../public/coverpic register.jpeg"
        alt="Cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Transparent Box with Text */}
      <Box
        sx={{
          width: "60%",
          position: "absolute",
          // top: 20,
          // left: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h3" component="h1">
          Welcome 
        </Typography>
        <Typography variant="body1">
        Register now to connect with clients, showcase your skills, and find opportunities that align with your expertise, and grow your business.        </Typography>
      </Box>
    </Box>
  );
};

export default RightSection;
