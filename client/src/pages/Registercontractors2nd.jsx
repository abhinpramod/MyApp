import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export default function ContractorVerificationStep2() {
  const [form, setForm] = useState({
    gstNumber: "",
    gstDocument: null,
    licenseDocument: null
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!form.gstNumber) tempErrors.gstNumber = "GST Number is required";
    if (!form.gstDocument) tempErrors.gstDocument = "GST Document is required";
    if (!form.licenseDocument) tempErrors.licenseDocument = "License Document is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append('gstNumber', form.gstNumber);
      formData.append('gstDocument', form.gstDocument);
      formData.append('licenseDocument', form.licenseDocument);
      try {
        const res = await axiosInstance.post("/contractor/verification", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.status === 200) toast.success("Verification details submitted successfully.");
        else toast.error("Submission failed!");
      } catch (error) {
        console.error("Error during verification submission:", error);
        toast.error("An error occurred during submission.");
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 6, width: "100%", maxWidth: 600 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>Contractor Verification</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} error={!!errors.gstNumber} helperText={errors.gstNumber} fullWidth />
          <Box sx={{ border: '2px dashed grey', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body1" mb={1}>Upload GST Document</Typography>
            <input type="file" name="gstDocument" onChange={handleChange} accept="image/*" style={{ display: 'block', margin: 'auto' }} />
            {errors.gstDocument && <Typography color="error">{errors.gstDocument}</Typography>}
          </Box>
          <Box sx={{ border: '2px dashed grey', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body1" mb={1}>Upload License Document</Typography>
            <input type="file" name="licenseDocument" onChange={handleChange} accept="image/*" style={{ display: 'block', margin: 'auto' }} />
            {errors.licenseDocument && <Typography color="error">{errors.licenseDocument}</Typography>}
          </Box>
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2, borderRadius: 3 }}>Submit</Button>
        </Box>
      </Paper>
    </Box>
  );
}