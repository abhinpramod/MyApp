// components/OTPModal.js
import React from "react";
import { Modal, Backdrop, Fade, Typography, Box, Button, TextField } from "@mui/material";

 const OTPModal = ({ showOtpModal, setShowOtpModal, otp, handleOtpChange, handleOtpKeyDown, verifyOtp }) => {
  return (
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
            <Button variant="contained" color="primary" onClick={verifyOtp}>
              Verify OTP
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};


export default OTPModal;