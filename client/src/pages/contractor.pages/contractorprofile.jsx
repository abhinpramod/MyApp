import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
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
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Camera,
  Trash2,
  CirclePlus,
  X,
  Pencil,
  Save,
  ChevronLeft,
  ChevronRight,
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
          loading="lazy"
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch contractor data
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

  

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        "/contractor/update-profile-pic",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setProfilePic(response.data.profilePicture);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(error.response?.data?.msg || "Failed to update profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job types change for interest form
  const handleJobTypesChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, jobTypes: value });
  };

  // Handle submit interest
  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.expectedDate) newErrors.expectedDate = "Expected date is required";
    if (formData.jobTypes.length === 0) newErrors.jobTypes = "At least one job type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post(`/user/contractor/interest/${profileContractorId}`, {formData,contractor});
      toast.success("Interest expressed successfully!");
      setShowInterestDialog(false);
      setFormData({
        phoneNumber: "",
        address: "",
        expectedDate: "",
        jobTypes: [],
      });
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast.error(error.response?.data?.message || "Failed to express interest");
    } finally {
      setIsLoading(false);
    }
  };

  // Carousel navigation functions
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === selectedProject?.media?.length - 1 ? 0 : prev + 1
    );
  }, [selectedProject]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedProject?.media?.length - 1 : prev - 1
    );
  }, [selectedProject]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setCurrentImageIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, nextImage, prevImage]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    setDragStartX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (dragStartX === null) return;
    
    const dragEndX = e.touches[0].clientX;
    const diff = dragStartX - dragEndX;

    if (diff > 50) nextImage();
    else if (diff < -50) prevImage();

    setDragStartX(null);
  }, [dragStartX, nextImage, prevImage]);

  // Handle edit description
  const handleEditDescription = () => {
    setTempDescription(contractor.description || "");
    setIsEditingDescription(true);
  };

  // Handle save description
  const handleSaveDescription = async () => {
    if (!tempDescription.trim()) {
      toast.error("Description cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.put("/contractor/update-description", {
        description: tempDescription
      });
      setContractor(prev => ({ ...prev, description: tempDescription }));
      setIsEditingDescription(false);
      toast.success("Description updated successfully");
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Failed to update description");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit employees
  const handleEditEmployees = () => {
    setTempNumberOfEmployees(numberOfEmployees);
    setIsEditingEmployees(true);
  };

  // Handle confirm employees change
  const handleConfirmEmployees = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/contractor/update-employees", {
        numberOfEmployees: tempNumberOfEmployees
      });
      setNumberOfEmployees(tempNumberOfEmployees);
      setIsEditingEmployees(false);
      setConfirmEmployeesOpen(false);
      toast.success("Number of employees updated");
    } catch (error) {
      console.error("Error updating employees:", error);
      toast.error("Failed to update employees");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirm availability change
const handleConfirmAvailability = async () => {
  try {
    setIsLoading(true);
    const newAvailability = !availability; // Toggle the current value
    await axiosInstance.put("/contractor/update-availability", {
      availability: newAvailability
    });
    setAvailability(newAvailability);
    setConfirmAvailabilityOpen(false);
    toast.success(`Availability set to ${newAvailability ? 'Available' : 'Not Available'}`);
  } catch (error) {
    console.error("Error updating availability:", error);
    toast.error("Failed to update availability");
  } finally {
    setIsLoading(false);
  }
};
  // Upload project media
  const uploadProjectMedia = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("media", file);
    });

    try {
      const response = await axiosInstance.post("/contractor/upload-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      return response.data.mediaUrls;
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media");
      throw error;
    } finally {
      setUploadProgress(0);
    }
  };

  // Handle project media upload
  const handleProjectMediaUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Limit to 3 files
    
    if (files.length + newProjectMedia.length > 3) {
      toast.error("You can upload a maximum of 3 files per project");
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
          file
        };
        setNewProjectMedia(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove media from new project
  const handleRemoveMedia = (id) => {
    setNewProjectMedia(prev => prev.filter(media => media.id !== id));
  };

  // Handle add project
  const handleAddProject = async () => {
    if (newProjectMedia.length === 0 || !newProjectDescription.trim()) {
      toast.error("Please provide at least one media file and a description");
      return;
    }

    try {
      setIsLoading(true);
      
      // Upload media files
      const files = newProjectMedia.map(m => m.file);
      const mediaUrls = await uploadProjectMedia(files);

      // Create project
      const response = await axiosInstance.post("/contractor/projects", {
        description: newProjectDescription,
        media: mediaUrls
      });
      
      setProjects(prev => [response.data.project, ...prev]);
      toast.success("Project added successfully!");
      setOpenProjectDialog(false);
      setNewProjectMedia([]);
      setNewProjectDescription("");
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/contractor/projects/${projectId}`);
      setProjects(prev => prev.filter(project => project._id !== projectId));
      toast.success("Project deleted successfully!");
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
      setDeleteConfirmationOpen(false);
    }
  };

  // Open delete confirmation
  const openDeleteConfirmation = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteConfirmationOpen(true);
  };

  if (isLoading && !uploadProgress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography>No contractor data found.</Typography>
      </div>
    );
  }

  return (
    <>
      {!isOwnerView && <Navbar />}

      <div className={`p-4 md:p-6 max-w-4xl mx-auto ${!isOwnerView && "mt-16 md:mt-20"}`}>
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Profile Picture and Description */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative">
              <Avatar
                sx={{ width: 120, height: 120 }}
                className="border-4 border-gray-200"
                src={profilePic || contractor.profilePicture || "/avatar.png"}
              />
              {isOwnerView && (
                <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-bold mt-4 text-center">{contractor.companyName}</h2>
            <h4 className="text-gray-600 text-center">{contractor.contractorName}</h4>

            {/* Description */}
            <div className="w-full mt-4">
              {isOwnerView && isEditingDescription ? (
                <div className="space-y-2">
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    variant="outlined"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outlined" onClick={() => setIsEditingDescription(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveDescription}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={isOwnerView ? handleEditDescription : undefined}
                  className={`p-4 rounded-lg ${
                    contractor.description 
                      ? "border border-gray-200 bg-white" 
                      : "border-2 border-dashed border-gray-300 bg-gray-50"
                  } ${isOwnerView ? "cursor-pointer hover:border-blue-300" : ""}`}
                >
                  <p className={contractor.description ? "text-gray-700" : "text-gray-500 italic"}>
                    {contractor.description || (isOwnerView ? "Click to add description..." : "No description")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full md:w-2/3 space-y-4">
            <DetailItem label="Email" value={contractor.email} />
            <DetailItem label="GST" value={contractor.gstNumber} />
            {contractor.phone && <DetailItem label="Phone" value={contractor.phone} />}
            <DetailItem 
              label="Address" 
              value={`${contractor.address}, ${contractor.city}, ${contractor.state}, ${contractor.country}`} 
            />
            {jobTypes.length > 0 && (
              <DetailItem label="Job Types" value={jobTypes.join(", ")} />
            )}

            {/* Number of Employees */}
            <div className="flex items-center gap-2">
              <span className="font-medium">Number of Employees:</span>
              {isOwnerView && isEditingEmployees ? (
                <div className="flex items-center gap-2">
                  <TextField
                    type="number"
                    value={tempNumberOfEmployees}
                    onChange={(e) => setTempNumberOfEmployees(e.target.value)}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <IconButton onClick={() => setConfirmEmployeesOpen(true)}>
                    <Save size={18} />
                  </IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{numberOfEmployees}</span>
                  {isOwnerView && (
                    <IconButton onClick={handleEditEmployees} size="small">
                      <Pencil size={16} />
                    </IconButton>
                  )}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              {isOwnerView ? (
                <>
                <Switch
  checked={availability}
  onCheckedChange={(newValue) => {
    setConfirmAvailabilityOpen(true);
    // No need to set tempAvailability anymore
  }}
/>
                  <span className={availability ? "text-green-600" : "text-red-600"}>
                    {availability ? "Available" : "Not Available"}
                  </span>
                </>
              ) : (
                <span className={contractor.availability ? "text-green-600" : "text-red-600"}>
                  {contractor.availability ? "Available" : "Not Available"}
                </span>
              )}
            </div>

            {/* Interest Button */}
            {!isOwnerView && (
              <button
                onClick={() => setShowInterestDialog(true)}
                className={`bg-red-600 text-white px-4 py-2 rounded-md w-full md:w-auto ${
                  contractor.availability ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!contractor.availability}
              >
                Express Interest
              </button>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Projects</h3>
            {isOwnerView && (
              <Button
                onClick={() => setOpenProjectDialog(true)}
                startIcon={<CirclePlus size={18} />}
                variant="contained"
              >
                Add Project
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="body1" color="textSecondary">
                No projects found
              </Typography>
            </div>
          ) : (
            <Grid container spacing={2}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <ProjectCard 
                    project={project} 
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentImageIndex(0);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </div>

        {/* Project View Dialog */}
        {selectedProject && (
          <Dialog
            open={!!selectedProject}
            onClose={() => {
              setSelectedProject(null);
              setCurrentImageIndex(0);
            }}
            fullScreen
            PaperProps={{
              sx: {
                bgcolor: 'black',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1 }}>
              <div className="flex justify-between items-center">
                <span>Project {currentImageIndex + 1} of {selectedProject.media?.length}</span>
                <IconButton 
                  onClick={() => {
                    setSelectedProject(null);
                    setCurrentImageIndex(0);
                  }}
                  color="inherit"
                >
                  <X />
                </IconButton>
              </div>
            </DialogTitle>
            
            <DialogContent 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 0
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* Left Arrow */}
              {selectedProject.media.length > 1 && (
                <IconButton
                  onClick={prevImage}
                  sx={{
                    position: 'fixed',
                    left: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    zIndex: 1
                  }}
                  size="large"
                >
                  <ChevronLeft />
                </IconButton>
              )}

              {/* Media Content */}
              <div className="w-full h-full flex items-center justify-center">
                {selectedProject.media[currentImageIndex]?.type === 'video' ? (
                  <video
                    src={selectedProject.media[currentImageIndex].url}
                    className="max-w-full max-h-full"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedProject.media[currentImageIndex]?.url}
                    alt={`Project media ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                  />
                )}
              </div>

              {/* Right Arrow */}
              {selectedProject.media.length > 1 && (
                <IconButton
                  onClick={nextImage}
                  sx={{
                    position: 'fixed',
                    right: 16,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    zIndex: 1
                  }}
                  size="large"
                >
                  <ChevronRight />
                </IconButton>
              )}

              {/* Dot Indicators */}
              {selectedProject.media.length > 1 && (
                <Box
                  sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    zIndex: 1
                  }}
                >
                  {selectedProject.media.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      sx={{
                        width: index === currentImageIndex ? 24 : 8,
                        height: 8,
                        bgcolor: index === currentImageIndex ? 'primary.main' : 'grey.500',
                        borderRadius: 4,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>
              )}
            </DialogContent>

            {/* Project Info */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'background.paper',
                color: 'text.primary',
                p: 2,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                zIndex: 1
              }}
            >
              <Typography variant="body1" textAlign="center">
                {selectedProject.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                Added on: {new Date(selectedProject.createdAt).toLocaleDateString()}
              </Typography>

              {/* Delete Button */}
              {isOwnerView && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Button
                    onClick={() => openDeleteConfirmation(selectedProject._id)}
                    color="error"
                    startIcon={<Trash2 size={18} />}
                  >
                    Delete Project
                  </Button>
                </Box>
              )}
            </Box>
          </Dialog>
        )}

        {/* Add Project Dialog */}
        {isOwnerView && (
          <Dialog
            open={openProjectDialog}
            onClose={() => {
              setOpenProjectDialog(false);
              setNewProjectMedia([]);
            }}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
              {uploadProgress > 0 && uploadProgress < 100 ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                  <CircularProgress variant="determinate" value={uploadProgress} size={60} />
                  <Typography mt={2}>
                    Uploading {uploadProgress}%
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Upload Media (1-3 files)
                    </Typography>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors">
                      <Box textAlign="center" py={3}>
                        <CirclePlus className="mx-auto text-gray-400" size={32} />
                        <Typography variant="body2" color="textSecondary">
                          Click to upload or drag and drop
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Images or videos (max 20MB each)
                        </Typography>
                      </Box>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleProjectMediaUpload}
                      />
                    </label>
                  </Box>

                  {newProjectMedia.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Selected Media ({newProjectMedia.length}/3)
                      </Typography>
                      <Grid container spacing={1}>
                        {newProjectMedia.map((media) => (
                          <Grid item xs={6} sm={4} key={media.id}>
                            <MediaPreview 
                              media={media} 
                              onRemove={handleRemoveMedia}
                              isOwnerView={isOwnerView}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
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
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setOpenProjectDialog(false);
                  setNewProjectMedia([]);
                }}
                disabled={uploadProgress > 0}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProject}
                variant="contained"
                disabled={
                  newProjectMedia.length === 0 || 
                  !newProjectDescription ||
                  uploadProgress > 0
                }
              >
                {uploadProgress > 0 ? 'Uploading...' : 'Add Project'}
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Interest Dialog */}
        <Dialog
          open={showInterestDialog}
          onClose={() => setShowInterestDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Express Interest</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitInterest}>
              <Box mb={2}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Address"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Expected Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                  error={!!errors.expectedDate}
                  helperText={errors.expectedDate}
                />
              </Box>
              <Box mb={2}>
                <FormControl fullWidth error={!!errors.jobTypes}>
                  <InputLabel>Job Types</InputLabel>
                  <Select
                    multiple
                    value={formData.jobTypes}
                    onChange={handleJobTypesChange}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.jobTypes && (
                    <Typography variant="caption" color="error">
                      {errors.jobTypes}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="outlined" onClick={() => setShowInterestDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialogs */}
        <ConfirmationDialog
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={() => handleDeleteProject(projectToDelete)}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
        />

        <ConfirmationDialog
          open={confirmEmployeesOpen}
          onClose={() => setConfirmEmployeesOpen(false)}
          onConfirm={handleConfirmEmployees}
          title="Update Employees"
          message="Are you sure you want to update the number of employees?"
        />

        <ConfirmationDialog
          open={confirmAvailabilityOpen}
          onClose={() => setConfirmAvailabilityOpen(false)}
          onConfirm={handleConfirmAvailability}
          title="Update Availability"
          message="Are you sure you want to change your availability status?"
        />
      </div>
    </>
  );
};

// Helper Components
const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-medium">{label}: </span>
    <span>{value}</span>
  </div>
);

const ProjectCard = ({ project, onClick }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}
  >
    <div className="relative h-48">
      {project.media[0] && project.media[0].type === 'video' ? (
        <video
          src={project.media[0].url}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
        />
      ) : (
        <img
          src={project.media[0] && project.media[0].url}
          alt="Project thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {project.media?.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          +{project.media.length - 1}
        </div>
      )}
    </div>
    <CardContent>
      <Typography 
        variant="body2" 
        className="line-clamp-2"
        title={project.description}
      >
        {project.description}
      </Typography>
    </CardContent>
  </Card>
);

export default DynamicProfile;