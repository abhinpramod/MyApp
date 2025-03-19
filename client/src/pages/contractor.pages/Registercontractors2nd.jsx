import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography, Avatar,IconButton } from "@mui/material";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import { useSelector } from "react-redux";
import useAuthCheck from "../../hooks/usecheakAuthcontractor";
import { useNavigate } from "react-router-dom";
import { Loader, Upload } from "lucide-react";
import Navbar from "../../components/Register/Registernav";
const ContractorVerificationStep2 = () => {
  const Navigate = useNavigate();
  const { loading } = useAuthCheck(); // Check authentication status
  const contractor = useSelector((state) => state.contractor.contractor); // Get contractor from Redux
  const [isloading, setisLoading] = useState(false);

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

    if (!contractor || !contractor._id) {
      toast.error("Contractor data is not available. Please try again.");
      return;
    }

    if (!validate()) return;

    const formData = new FormData();
    formData.append("gstNumber", form.gstNumber);
    formData.append("gstDocument", form.gstDocument);
    formData.append("licenseDocument", form.licenseDocument);

    try {
      setisLoading(true);
      const res = await axiosInstance.post(
        `/contractor/register2ndstep${contractor._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        toast.success("Verification details submitted successfully.");
        setForm({ gstNumber: "", gstDocument: null, licenseDocument: null });

        Navigate("/contractordashboard");
        setisLoading(false);
      } else {
        toast.error("Submission failed!");
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      console.error("Error during verification submission:", error);
      toast.error("An error occurred during submission.");

    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">
  <Loader className="size-10 animate-spin" />
</div>;
  if (!contractor) return <Typography>Error: No contractor data found.</Typography>;
 
  if (isloading) return <div className="flex items-center justify-center h-screen">
  <Loader className="size-10 animate-spin" />
  
</div>;
  return (
<>
<Navbar />

    <Box sx={{ minHeight: "100vh", display: "flex",  alignItems: "center", justifyContent: "center", p: 2, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}>
      <Paper elevation={8} sx={{ p: 4, mt: 0, borderRadius: 2, width: "100%", maxWidth: 650, background: "#ffffff", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
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
          <FileUpload name="gstDocument" label="Upload GST Document" file={form.gstDocument} onChange={handleChange} error={errors.gstDocument} />
          <FileUpload name="licenseDocument" label="Upload License Document" file={form.licenseDocument} onChange={handleChange} error={errors.licenseDocument} />
          <Button type="submit" variant="contained" color="error" size="large" sx={{ mt: 2, borderRadius: 3, fontWeight: "bold" }}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>  </>


  );
};

// Reusable File Upload Component
const FileUpload = ({ name, label, file, onChange, error }) => (
  <Box sx={{ border: "2px dashed ", p: 2, borderRadius: 2, textAlign: "center", backgroundColor: "" }}>
    <Typography variant="body1" mb={1} color="textSecondary">
      {label}
    </Typography>
    <input type="file" name={name} onChange={onChange} accept="image/*" style={{ display: "none" }} id={name} />
    <label htmlFor={name}>
      <Button variant="outlined" component="span" color="dark">
      <Upload />
      </Button>
    </label>
    {file && (
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Selected File: {file.name}
        </Typography>
        <Avatar src={URL.createObjectURL(file)} alt={`${label} Preview`} variant="rounded" sx={{ width: 100, height: 100, mt: 2, mx: "auto" }} />
      </Box>
    )}
    {error && <Typography color="error">{error}</Typography>}
  </Box>
);

export default ContractorVerificationStep2;
