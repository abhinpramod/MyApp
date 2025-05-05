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
  TextField,
  DialogActions,
  Button,
  Chip,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import {
  Camera,
  Trash2,
  CirclePlus,
  X,
  Pencil,
  Save,
  Loader,
  Video,
  Image,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Switch from "../../components/ui/switch";
import Navbar from "../../components/Navbar";

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MediaPreview = ({ media, onRemove, isOwnerView }) => {
  return (
    <div className="relative group">
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg"
        />
      ) : (
        <video
          src={media.url}
          className="w-full h-32 object-cover rounded-lg"
          controls={false}
        />
      )}
      {isOwnerView && (
        <button
          onClick={() => onRemove(media.id)}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {media.type === 'image' ? 'Image' : 'Video'}
      </div>
    </div>
  );
};

const DynamicProfile = () => {
  const navigate = useNavigate();
  const { contractorId: paramContractorId } = useParams();
  const currentContractor = useSelector((state) => state.contractor);

  // Determine view mode
  const isOwnerView = !paramContractorId;
  const profileContractorId = isOwnerView
    ? currentContractor?.contractor?._id
    : paramContractorId;

  // State management
  const [contractor, setContractor] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    expectedDate: "",
    jobTypes: [],
  });
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [newProjectMedia, setNewProjectMedia] = useState([]);
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState(0);
  const [isEditingEmployees, setIsEditingEmployees] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [confirmEmployeesOpen, setConfirmEmployeesOpen] = useState(false);
  const [confirmAvailabilityOpen, setConfirmAvailabilityOpen] = useState(false);
  const [tempNumberOfEmployees, setTempNumberOfEmployees] = useState(0);
  const [tempAvailability, setTempAvailability] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Mock data for testing UI
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setContractor({
        companyName: "Mock Construction Co.",
        contractorName: "John Doe",
        email: "john@mock.com",
        gstNumber: "GST123456789",
        phone: "9876543210",
        address: "123 Mock Street, Mockville",
        city: "Mockville",
        state: "Mockstate",
        country: "Mockland",
        jobTypes: ["Plumbing", "Electrical", "Carpentry"],
        description: "This is a mock contractor description for UI testing.",
        availability: true,
        numberOfEmployees: 5,
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
      });

      setProjects([
        {
          _id: "1",
          description: "Beautiful kitchen renovation",
          media: [
            { id: "1", type: "image", url: "https://source.unsplash.com/random/300x300?kitchen" },
            { id: "2", type: "image", url: "https://source.unsplash.com/random/300x300?kitchen2" },
            { id: "3", type: "video", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
          ],
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          description: "Bathroom remodeling project",
          media: [
            { id: "4", type: "image", url: "https://source.unsplash.com/random/300x300?bathroom" },
            { id: "5", type: "video", url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4" },
          ],
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    const fetchContractorData = async () => {
      if (!profileContractorId) return;

      try {
        setIsLoading(true);
        const endpoint = isOwnerView
          ? "/contractor/profile"
          : `/user/contractors/${profileContractorId}`;

        const response = await axiosInstance.get(endpoint);
        const data = response.data;

        setContractor(data);
        setProjects(data.projects || []);
        setJobTypes(data.jobTypes || []);
        setAvailability(data.availability || false);
        setProfilePic(data.profilePicture || "");
        setNumberOfEmployees(data.numberOfEmployees || 0);
        setTempDescription(data.description || "");
      } catch (error) {
        console.error("Failed to fetch contractor data:", error);
        if (error.response?.status === 401) {
          toast.error("You are not authorized to view this page.");
          navigate("/");
          return;
        }
        toast.error("Failed to fetch contractor data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractorData();
  }, [profileContractorId, isOwnerView, navigate]);

  const handleJobTypesChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, jobTypes: value });
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = {};
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
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
      setIsLoading(true);
      await axiosInstance.post(
        `/user/contractor/interest/${profileContractorId}`,
        {
          formData,
          contractor,
        }
      );
      toast.success("Interest expressed successfully!");
      setShowInterestDialog(false);
      setFormData({
        phoneNumber: "",
        address: "",
        expectedDate: "",
        jobTypes: [],
      });
    } catch (error) {
      if (error.response?.status === 403) {
        return toast.error(error.response.data.msg);
      }
      console.error("Failed to express interest:", error);
      toast.error("Failed to express interest");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDescription = () => {
    setTempDescription(contractor.description || "");
    setIsEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put("/contractor/updatedescription", {
        description: tempDescription,
      });
      setContractor((prev) => ({ ...prev, description: tempDescription }));
      setIsEditingDescription(false);
      toast.success("Description updated successfully!");
    } catch (error) {
      toast.error("Failed to update description");
    }
    setIsLoading(false);
  };

  const handleEditEmployees = () => {
    setTempNumberOfEmployees(numberOfEmployees);
    setIsEditingEmployees(true);
  };

  const handleConfirmEmployees = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put("/contractor/employeesnumber", {
        numberOfEmployees: tempNumberOfEmployees,
      });
      setNumberOfEmployees(tempNumberOfEmployees);
      setIsEditingEmployees(false);
      toast.success("Number of employees updated successfully!");
    } catch (error) {
      toast.error("Failed to update number of employees");
    }
    setIsLoading(false);
    setConfirmEmployeesOpen(false);
  };

  const handleConfirmAvailability = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put("/contractor/availability", {
        availability: tempAvailability,
      });
      setAvailability(tempAvailability);
      toast.success(
        `Availability set to ${tempAvailability ? "Available" : "Not Available"}`
      );
    } catch (error) {
      toast.error("Failed to update availability");
    }
    setIsLoading(false);
    setConfirmAvailabilityOpen(false);
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected");
    setIsLoading(true);

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await axiosInstance.put("/contractor/updateProfilePic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const response = await axiosInstance.get("/contractor/profile");
      setContractor(response.data);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(
        error.response?.data?.msg || "Failed to update profile picture"
      );
    }
    setIsLoading(false);
  };

  const handleProjectMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + newProjectMedia.length > 10) {
      toast.error("You can upload a maximum of 10 files per project");
      return;
    }

    files.forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 20MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newMedia = {
          id: Math.random().toString(36).substring(7),
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: reader.result,
          file // Keep the file reference for actual upload
        };
        setNewProjectMedia(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (id) => {
    setNewProjectMedia(prev => prev.filter(media => media.id !== id));
  };

  const handleAddProject = async () => {
    if (newProjectMedia.length === 0 || !newProjectDescription) {
      toast.error("Please provide at least one media file and a description");
      return;
    }

    // In a real implementation, you would upload the files here
    console.log("Would upload:", {
      media: newProjectMedia,
      description: newProjectDescription
    });

    // Mock implementation for UI
    const newProject = {
      _id: Math.random().toString(36).substring(7),
      description: newProjectDescription,
      media: newProjectMedia.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url // In real app, this would be the uploaded URL
      })),
      createdAt: new Date().toISOString()
    };

    setProjects([...projects, newProject]);
    toast.success("Project added successfully!");
    setOpenProjectDialog(false);
    setNewProjectMedia([]);
    setNewProjectDescription("");
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete("/contractor/deleteproject", {
        data: { projectId },
      });
      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );
      toast.success("Project deleted successfully!");
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
    setIsLoading(false);
  };

  const openDeleteConfirmation = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteConfirmationOpen(true);
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
      {!isOwnerView && <Navbar />}

      <div
        className={`p-6 max-h-fit min-h-screen max-w-4xl mx-auto shadow-lg rounded-2xl ${!isOwnerView && "mt-20"}  `}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="relative">
              <Avatar
                sx={{ width: 128, height: 128 }}
                className="rounded-full border-4 border-gray-200"
                src={
                  profilePic ||
                  contractor.profilePicture ||
                  "../../public/avatar.png"
                }
              />
              {isOwnerView && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 bg-gray-800 p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                  />
                </label>
              )}
            </div>
            <h2 className="text-xl font-bold mt-4">{contractor.companyName}</h2>
            <h4 className="font-semibold text-gray-600">
              {contractor.contractorName}
            </h4>

            {/* Description Section */}
            <div className="w-full mt-2">
              {isOwnerView && isEditingDescription ? (
                <div className="space-y-2">
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    placeholder="Tell us about your company..."
                    variant="outlined"
                    className="bg-gray-50 rounded-lg"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsEditingDescription(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveDescription}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={isOwnerView ? handleEditDescription : undefined}
                  className={`p-4 rounded-lg transition-all ${
                    contractor.description
                      ? "border border-gray-200 hover:border-blue-300 bg-white" +
                        (isOwnerView ? " cursor-text" : "")
                      : "border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50" +
                        (isOwnerView ? " cursor-pointer" : "")
                  }`}
                >
                  <p
                    className={`text-center ${
                      contractor.description
                        ? "text-gray-700"
                        : "text-gray-500 italic"
                    }`}
                  >
                    {contractor.description ||
                      (isOwnerView
                        ? "Click here to add a description..."
                        : "No description provided")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contractor Details Section */}
          <div className="w-full md:w-2/3 space-y-4">
            <p className="text-gray-600">
              <strong>Email:</strong> {contractor.email}
            </p>
            <p className="text-gray-600">
              <strong>GST:</strong> {contractor.gstNumber}
            </p>
            {contractor.phone && (
              <p className="text-gray-600">
                <strong>Phone:</strong> {contractor.phone}
              </p>
            )}
            <p className="text-gray-600">
              <strong>Address:</strong> {contractor.address}, {contractor.city},{" "}
              {contractor.state}, {contractor.country}
            </p>
            {jobTypes.length > 0 && (
              <p className="text-gray-600">
                <strong>Job Types:</strong> {jobTypes.join(", ")}
              </p>
            )}

            {/* Number of Employees */}
            <div className="flex items-center gap-2">
              <strong>Number of Employees:</strong>
              {isOwnerView && isEditingEmployees ? (
                <div className="flex items-center gap-2">
                  <TextField
                    type="number"
                    value={tempNumberOfEmployees}
                    onChange={(e) => setTempNumberOfEmployees(e.target.value)}
                    size="small"
                    className="w-16"
                  />
                  <IconButton
                    onClick={() => setConfirmEmployeesOpen(true)}
                    className="hover:dark text-white"
                  >
                    <Save size={15} />
                  </IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{numberOfEmployees}</span>
                  {isOwnerView && (
                    <IconButton
                      onClick={handleEditEmployees}
                      className="hover:bg-black"
                    >
                      <Pencil size={15} />
                    </IconButton>
                  )}
                </div>
              )}
            </div>

            {/* Availability Section */}
            <div className="flex items-center gap-2 mt-3">
              {isOwnerView ? (
                <>
                  <Switch
                    checked={availability}
                    onCheckedChange={(checked) => {
                      setTempAvailability(checked);
                      setConfirmAvailabilityOpen(true);
                    }}
                  />
                  <span
                    className={availability ? "text-green-600" : "text-red-600"}
                  >
                    {availability ? "Available" : "Not Available"}
                  </span>
                </>
              ) : (
                <span
                  className={
                    contractor.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {contractor.availability ? "Available" : "Not Available"}
                </span>
              )}
            </div>

            {/* Interest Button - Only show for user view */}
            {!isOwnerView && (
              <button
                onClick={() => setShowInterestDialog(true)}
                className={`bg-red-700 text-white px-4 w-1/2 h-8 rounded-md mt-4 ${
                  contractor.availability ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!contractor.availability}
              >
                Interested
              </button>
            )}
          </div>
        </div>

        {/* Project List */}
        <hr className="my-6 border-gray-200" />

        {/* Add Project Button - Only for owner view */}
        {isOwnerView && (
          <Button
            onClick={() => setOpenProjectDialog(true)}
            className="flex items-center gap-2 text-sm font-semibold hover:text-gray-800 transition-colors"
            startIcon={<CirclePlus size={18} />}
          >
            Add Project
          </Button>
        )}

        <Grid container spacing={3} className="mt-6">
          {projects.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow mt-4 h-90 flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-40 w-full overflow-hidden relative">
                  {project.media && project.media[0].type === 'video' ? (
                    <video
                      src={project.media[0].url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                    />
                  ) : (
                    <img
                      src={project.media && project.media[0].url}
                      className="w-full h-full object-cover"
                      alt={`Project ${index + 1}`}
                    />
                  )}
                  {project.media?.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      +{project.media.length - 1} more
                    </div>
                  )}
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
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {selectedProject?.media?.map((media, index) => (
                <Tab
                  key={index}
                  icon={
                    media.type === 'image' ? (
                      <Image size={20} />
                    ) : (
                      <Video size={20} />
                    )
                  }
                  label={`Media ${index + 1}`}
                />
              ))}
            </Tabs>
            <Box sx={{ p: 2 }}>
              {selectedProject?.media?.[tabValue]?.type === 'video' ? (
                <video
                  src={selectedProject?.media[tabValue].url}
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedProject?.media?.[tabValue]?.url}
                  alt="Selected Project"
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
              )}
            </Box>
            <div className="mt-4">
              <p className="text-center text-lg text-gray-600">
                {selectedProject?.description}
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Added on:{" "}
                {new Date(selectedProject?.createdAt).toLocaleString()}
              </p>
            </div>
            
            {/* Media thumbnails grid */}
            <div className="mt-4">
              <Typography variant="subtitle1" gutterBottom>
                All Media ({selectedProject?.media?.length})
              </Typography>
              <Grid container spacing={1}>
                {selectedProject?.media?.map((media, index) => (
                  <Grid item xs={4} sm={3} md={2} key={index}>
                    <div 
                      className={`cursor-pointer border-2 rounded ${tabValue === index ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setTabValue(index)}
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.url}
                          className="w-full h-24 object-cover rounded"
                          muted
                        />
                      ) : (
                        <img
                          src={media.url}
                          className="w-full h-24 object-cover rounded"
                          alt={`Thumbnail ${index + 1}`}
                        />
                      )}
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </DialogContent>
          {/* Delete button only for owner view */}
          {isOwnerView && (
            <DialogActions>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmation(selectedProject?._id);
                }}
                color="error"
                startIcon={<Trash2 size={20} />}
              >
                Delete
              </Button>
            </DialogActions>
          )}
        </Dialog>

        {/* Add Project Dialog - Owner only */}
        {isOwnerView && (
          <Dialog
            open={openProjectDialog}
            onClose={() => {
              setOpenProjectDialog(false);
              setNewProjectMedia([]);
            }}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Media (Images or Videos)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CirclePlus className="w-8 h-8 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Images (JPEG, PNG) and Videos (MP4) up to 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleProjectMediaUpload}
                    />
                  </label>
                </div>
              </div>

              {newProjectMedia.length > 0 && (
                <div className="mb-4">
                  <Typography variant="subtitle2" gutterBottom>
                    Media Preview ({newProjectMedia.length}/10)
                  </Typography>
                  <Grid container spacing={1}>
                    {newProjectMedia.map((media) => (
                      <Grid item xs={6} sm={4} md={3} key={media.id}>
                        <MediaPreview 
                          media={media} 
                          onRemove={handleRemoveMedia}
                          isOwnerView={isOwnerView}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}

              <TextField
                label="Project Description"
                fullWidth
                multiline
                rows={3}
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                margin="normal"
              />

              <div className="mt-2 text-xs text-gray-500">
                <p>Tips for a great project post:</p>
                <ul className="list-disc pl-5">
                  <li>Upload high-quality photos and videos</li>
                  <li>Include before/after shots if possible</li>
                  <li>Describe the challenges and solutions</li>
                  <li>Keep descriptions concise but informative</li>
                </ul>
              </div>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setOpenProjectDialog(false);
                  setNewProjectMedia([]);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddProject} 
                variant="contained"
                disabled={newProjectMedia.length === 0 || !newProjectDescription}
              >
                Add Project
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Interest Dialog - For users expressing interest */}
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

        {/* Confirmation Dialogs - Owner only */}
        {isOwnerView && (
          <>
            <ConfirmationDialog
              open={deleteConfirmationOpen}
              onClose={() => setDeleteConfirmationOpen(false)}
              onConfirm={() => {
                handleDeleteProject(projectToDelete);
                setDeleteConfirmationOpen(false);
              }}
              title="Delete Project"
              message="Are you sure you want to delete this project?"
            />

            <ConfirmationDialog
              open={confirmEmployeesOpen}
              onClose={() => setConfirmEmployeesOpen(false)}
              onConfirm={handleConfirmEmployees}
              title="Update Number of Employees"
              message="Are you sure you want to update the number of employees?"
            />

            <ConfirmationDialog
              open={confirmAvailabilityOpen}
              onClose={() => setConfirmAvailabilityOpen(false)}
              onConfirm={handleConfirmAvailability}
              title="Update Availability"
              message="Are you sure you want to update your availability?"
            />
          </>
        )}
      </div>
    </>
  );
};

export default DynamicProfile;