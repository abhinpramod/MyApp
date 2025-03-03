import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography, Avatar } from "@mui/material";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

const ContractorVerificationStep2 = () => {
  const [form, setForm] = useState({
    gstNumber: "",
    gstDocument: null,
    licenseDocument: null,
  });
  const [errors, setErrors] = useState({});

  // Regex for GST number validation (basic format: 15 digits)
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;


  const validate = () => {
    const tempErrors = {};
    if (!form.gstNumber) {
      tempErrors.gstNumber = "GST Number is required";
    } else if (!gstRegex.test(form.gstNumber)) {
      tempErrors.gstNumber = "Invalid GST Number format";
    }
    if (!form.gstDocument) tempErrors.gstDocument = "GST Document is required";
    if (!form.licenseDocument) tempErrors.licenseDocument = "License Document is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('gstNumber', form.gstNumber);
    formData.append('gstDocument', form.gstDocument);
    formData.append('licenseDocument', form.licenseDocument);

    try {
      const res = await axiosInstance.post("/contractor/register2ndstep", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200) {
        toast.success("Verification details submitted successfully.");
        setForm({ gstNumber: "", gstDocument: null, licenseDocument: null }); // Reset form
      } else {
        toast.error("Submission failed!");
      }
    } catch (error) {
      console.error("Error during verification submission:", error);
      toast.error("An error occurred during submission.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 6,
          width: "100%",
          maxWidth: 600,
          background: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center" color="">
          Contractor Verification
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="GST Number"
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            error={!!errors.gstNumber}
            helperText={errors.gstNumber}
            fullWidth
            variant="outlined"
            placeholder="Enter 15-digit GST Number"
          />
          <Box
            sx={{
              border: "2px dashed #1976d2",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#f0f4f8",
            }}
          >
            <Typography variant="body1" mb={1} color="textSecondary">
              Upload GST Document
            </Typography>
            <input
              type="file"
              name="gstDocument"
              onChange={handleChange}
              accept="image/*"
              style={{ display: "none" }}
              id="gstDocument"
            />
            <label htmlFor="gstDocument">
              <Button variant="outlined" component="span">
                Choose File
              </Button>
            </label>
            {form.gstDocument && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Selected File: {form.gstDocument.name}
                </Typography>
                <Avatar
                  src={URL.createObjectURL(form.gstDocument)}
                  alt="GST Document Preview"
                  variant="rounded"
                  sx={{ width: 100, height: 100, mt: 2, mx: "auto" }}
                />
              </Box>
            )}
            {errors.gstDocument && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.gstDocument}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              border: "2px dashed #1976d2",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#f0f4f8",
            }}
          >
            <Typography variant="body1" mb={1} color="textSecondary">
              Upload License Document
            </Typography>
            <input
              type="file"
              name="licenseDocument"
              onChange={handleChange}
              accept="image/*"
              style={{ display: "none" }}
              id="licenseDocument"
            />
            <label htmlFor="licenseDocument">
              <Button variant="outlined" component="span" color="">
                Choose File
              </Button>
            </label>
            {form.licenseDocument && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Selected File: {form.licenseDocument.name}
                </Typography>
                <Avatar
                  src={URL.createObjectURL(form.licenseDocument)}
                  alt="License Document Preview"
                  variant="rounded"
                  sx={{ width: 100, height: 100, mt: 2, mx: "auto" }}
                />
              </Box>
            )}
            {errors.licenseDocument && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.licenseDocument}
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2, borderRadius: 3, fontWeight: "bold" }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContractorVerificationStep2;