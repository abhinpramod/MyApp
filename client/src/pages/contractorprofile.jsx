import React ,{ useState, useEffect } from "react";
import { Card, CardContent, Typography, Switch, Button, Avatar, IconButton, Box, Grid } from "@mui/material";
import { Camera, X } from "lucide-react";
import axiosInstance from "../lib/axios";
import axios from "axios";

const ContractorProfile = () => {
  const [contractor, setContractor] = useState(null);
  const [availability, setAvailability] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("/api/contractor/profile").then((res) => {
      setContractor(res.data);
      setAvailability(res.data.availability);
      setProfilePic(res.data.profilePic);
      setProjects(res.data.projects || []);
    });
  }, []);

  useEffect(() => {
    const res=axiosInstance.get(`/contractor/profile`)
  }, []);

  const handleAvailabilityChange = async () => {
    setAvailability(!availability);
    await axios.put("/api/contractor/profile", { availability: !availability });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    const res = await axios.put("/api/contractor/profile-pic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfilePic(res.data.profilePic);
  };

  const handleAddProject = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("projectImage", file);

    const res = await axios.post("/api/contractor/add-project", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProjects([...projects, res.data.project]);
  };

  const handleRemoveProject = async (projectId) => {
    await axios.delete(`/api/contractor/remove-project/${projectId}`);
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  if (!contractor) return <Typography variant="h6" textAlign="center">Loading...</Typography>;

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 4, boxShadow: 10, borderRadius: 5, bgcolor: "#ffffff" }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Profile
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box position="relative">
            <Avatar src={profilePic} sx={{ width: 140, height: 140, border: "4px solid #1976d2" }} />
            <label htmlFor="upload-profile-pic">
              <IconButton
                sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "#1976d2", color: "white", boxShadow: 3 }}
                component="span"
              >
                <Camera size={24} />
              </IconButton>
            </label>
          </Box>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} id="upload-profile-pic" />
        </Box>
        <Box mt={3} textAlign="center">
          <Typography variant="h6">{contractor.contractorName}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{contractor.companyName}</Typography>
          <Typography variant="body2" color="text.secondary">{contractor.email}</Typography>
          <Typography variant="body2" color="text.secondary">GST: {contractor.gstNumber}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <Typography variant="h6" mr={2}>Availability</Typography>
          <Switch checked={availability} onChange={handleAvailabilityChange} color="success" />
        </Box>
        <Typography variant="h5" fontWeight="bold" mt={3} gutterBottom>
          Past Projects
        </Typography>
        <input type="file" accept="image/*" onChange={handleAddProject} style={{ display: "none" }} id="upload-project" />
        <label htmlFor="upload-project">
          <Button variant="contained" color="primary" component="span" sx={{ mt: 1, mb: 2 }}>
            Add Project
          </Button>
        </label>
        <Grid container spacing={2} justifyContent="center">
          {projects.map((project) => (
            <Grid item key={project.id} xs={6} sm={4} md={3} sx={{ position: "relative" }}>
              <img src={project.imageUrl} alt="Project" width="100%" style={{ borderRadius: 8, boxShadow: 3 }} />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveProject(project.id)}
                sx={{ position: "absolute", top: 5, right: 5, bgcolor: "white", borderRadius: "50%" }}
              >
                <X size={18} />
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContractorProfile;
