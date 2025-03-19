import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { X, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ContractorProfile = () => {
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { contractorId } = useParams();
  const [jobTypes, setJobTypes] = useState([]);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    expectedDate: "",
    jobTypes: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchContractorData = async () => {
      if (!contractorId) return;

      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/user/contractor/${contractorId}`
        );
        setContractor(response.data);
        setProjects(response.data.projects || []);
        setJobTypes(response.data.jobTypes || []);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("You are not authorized to view this page.");
          navigate("/");
          return;
        }
        console.error("Failed to fetch contractor data:", error);
        toast.error("Failed to fetch contractor data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractorData();
  }, [contractorId]);

  const handleJobTypesChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, jobTypes: value });
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    console.log(formData);
    

    // Validation logic
    const newErrors = {};
    if (!formData.phoneNumber){ newErrors.phoneNumber = "Phone number is required";
    }else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }      
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.expectedDate)
      newErrors.expectedDate = "Expected date is required";
    if (formData.jobTypes.length === 0)
      newErrors.jobTypes = "At least one job type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axiosInstance.post(
        `/user/contractor/interest/${contractorId}`,
        formData
      );
      toast.success("Interest expressed successfully!");
      setShowInterestDialog(false);
    } catch (error) {
      console.error("Failed to express interest:", error);
      toast.error("Failed to express interest");
    }
  };

  if (isLoading) {
    return (
      <center>
        <Loader className="size-10 mt-60 animate-spin" />
      </center>
    );
  }

  if (!contractor) {
    return <div>No contractor data found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-h-fit min-h-screen max-w-4xl mx-auto shadow-lg rounded-2xl mt-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="relative">
              <Avatar
                sx={{ width: 128, height: 128 }}
                className="rounded-full border-4 border-gray-200"
                src={contractor.profilePicture || "/default-profile.png"}
              />
            </div>
            <h2 className="text-xl font-bold mt-4">{contractor.companyName}</h2>
            <h4 className="font-semibold text-gray-600">
              {contractor.contractorName}
            </h4>
            <p className="text-gray-500 text-center mt-2">
              {contractor.description}
            </p>
          </div>

          {/* Contractor Details Section */}
          <div className="w-full md:w-2/3 space-y-4">
            <p className="text-gray-600">
              <strong>Email:</strong> {contractor.email}
            </p>
            <p className="text-gray-600">
              <strong>GST:</strong> {contractor.gstNumber}
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> {contractor.address}, {contractor.city},{" "}
              {contractor.state}, {contractor.country}
            </p>

            {/* Availability Section */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={
                  contractor.availability ? "text-green-600" : "text-red-600"
                }
              >
                {contractor.availability ? "Available" : "Not Available"}
              </span>
            </div>

            {/* Employee Number Section */}
            <div className="flex items-center gap-2">
              <strong>Number of Employees:</strong>
              <span>{contractor.numberOfEmployees}</span>
            </div>

            {/* Interested Button */}
            <button
              onClick={() => setShowInterestDialog(true)}
              className="bg-red-700 text-white px-4 w-1/2 h-8 rounded-md mt-4"
            >
              Interested
            </button>
          </div>
        </div>

        {/* Project List */}
        <hr className="my-6 border-gray-200" />
        <Grid container spacing={3} className="mt-6">
          {projects.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow mt-4 h-90 flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-40 w-full overflow-hidden">
                  <CardMedia
                    component="img"
                    className="w-full h-full object-cover"
                    image={project.image || "/default-project.png"}
                    alt={`Project ${index + 1}`}
                  />
                </div>
                <CardContent className="flex-grow flex items-center justify-center">
                  <p className="text-center text-sm font-semibold text-gray-600">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Full-Screen Project View */}
        <Dialog
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          fullScreen
        >
          <DialogTitle>
            <div className="flex justify-between items-center">
              <span>Project Details</span>
              <IconButton onClick={() => setSelectedProject(null)}>
                <X size={24} />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-col items-center">
              <img
                src={selectedProject?.image || "/default-project.png"}
                alt="Selected Project"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              <p className="text-center text-lg mt-4 text-gray-600">
                {selectedProject?.description}
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Added on:{" "}
                {new Date(selectedProject?.createdAt).toLocaleString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Interest Dialog */}
        <Dialog
          open={showInterestDialog}
          onClose={() => setShowInterestDialog(false)}
          fullWidth
          
        
        >
          <DialogTitle>Express Interest</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitInterest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    // required
                  />
                  {errors.phoneNumber && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.phoneNumber}
                    </Typography>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md shadow-sm h-24 p-2 resize-none"
                    // required
                  />
                  {errors.address && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.address}
                    </Typography>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    // required
                  />
                  {errors.expectedDate && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.expectedDate}
                    </Typography>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    {/* <InputLabel id="jobTypes-label">Job Types</InputLabel>   */}
                    <Select
                      labelId="jobTypes-label"
                      name="jobTypes"
                      value={formData.jobTypes}
                      onChange={handleJobTypesChange}
                      multiple
                      fullWidth
                      variant="outlined"
                      error={!!errors.jobTypes}
                      sx={{ borderRadius: "8px" }}
                    >
                      {jobTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.jobTypes && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        {errors.jobTypes}
                      </Typography>
                    )}
                  </FormControl>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowInterestDialog(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Submit Interest
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ContractorProfile;
