import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export default function ContractorregisterStep2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    gstNumber: "",
    gstDocument: null,
    licenseDocument: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.gstNumber) tempErrors.gstNumber = "GST Number is required";
    if (!form.gstDocument) tempErrors.gstDocument = "GST Document is required";
    if (!form.licenseDocument)
      tempErrors.licenseDocument = "License Document is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("gstNumber", form.gstNumber);
      formData.append("gstDocument", form.gstDocument);
      formData.append("licenseDocument", form.licenseDocument);

      try {
        const res = await axiosInstance.post(
          "/contractor/verify2ndstep",
          formData
        );
        if (res.status === 200) {
          toast.success("Verification documents uploaded successfully!");
          navigate("/");
        } else {
          toast.error("Verification failed!");
        }
      } catch (error) {
        console.error("Error during verification:", error);
        toast.error("An error occurred during verification.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          elevation={8}
          sx={{ p: 4, borderRadius: 6, width: "100%", maxWidth: 600 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Contractor Verification - Step 2
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="GST Number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              fullWidth
            />
            <Button variant="contained" component="label" fullWidth>
              Upload GST Document
              <input
                type="file"
                hidden
                name="gstDocument"
                onChange={handleFileChange}
              />
            </Button>
            {errors.gstDocument && (
              <Typography color="error">{errors.gstDocument}</Typography>
            )}

            <Button variant="contained" component="label" fullWidth>
              Upload License Document
              <input
                type="file"
                hidden
                name="licenseDocument"
                onChange={handleFileChange}
              />
            </Button>
            {errors.licenseDocument && (
              <Typography color="error">{errors.licenseDocument}</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2, borderRadius: 3 }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}
