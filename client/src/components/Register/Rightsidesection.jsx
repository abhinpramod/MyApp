// components/RightSection.js
import React from "react";
import { Box } from "@mui/material";

 const RightSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <img src="../../../../public/login.image.png" alt="" />
    </Box>
  );
};

export default RightSection;