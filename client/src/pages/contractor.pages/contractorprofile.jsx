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
} from "@mui/material";
import {
  Camera,
  Trash2,
  CirclePlus,
  X,
  Pencil,
  Save,
  Loader,
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
  const [newProjectImage, setNewProjectImage] = useState(null);
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
    if (!formData.expectedDate) newErrors.expectedDate = "Expected date is required";
    if (formData.jobTypes.length === 0) newErrors.jobTypes = "At least one job type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setIsLoading(true);
      await axiosInstance.post(`/user/contractor/interest/${profileContractorId}`, {
        formData,
        contractor
      });
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
      setContractor(prev => ({ ...prev, description: tempDescription }));
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
      toast.error(error.response?.data?.msg || "Failed to update profile picture");
    }
    setIsLoading(false);
  };

  const handleProjectImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewProjectImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = async () => {
    if (!newProjectImage || !newProjectDescription) {
      toast.error("Please provide both an image and a description");
      return;
    }

    const formData = new FormData();
    formData.append("image", newProjectImage);
    formData.append("description", newProjectDescription);

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/contractor/addprojects",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProjects([...projects, response.data.project]);
      toast.success("Project added successfully!");
      setOpenProjectDialog(false);
      setNewProjectImage(null);
      setNewProjectDescription("");
    } catch (error) {
      toast.error("Failed to add project");
    }
    setIsLoading(false);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete("/contractor/deleteproject", {
        data: { projectId },
      });
      setProjects(prev => prev.filter(project => project._id !== projectId));
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
    
    <div className={`p-6 max-h-fit min-h-screen max-w-4xl mx-auto shadow-lg rounded-2xl ${!isOwnerView && "mt-20"}  `}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="relative">
            <Avatar
              sx={{ width: 128, height: 128 }}
              className="rounded-full border-4 border-gray-200"
              src={profilePic || contractor.profilePicture || "../../public/avatar.png"}
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
                <p className={`text-center ${
                  contractor.description 
                    ? "text-gray-700" 
                    : "text-gray-500 italic"
                }`}>
                  {contractor.description || 
                    (isOwnerView ? "Click here to add a description..." : "No description provided")}
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
        >
          <CirclePlus size={18} /> Add Project
        </Button>
      )}

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
        {/* Delete button only for owner view */}
        {isOwnerView && (
          <DialogActions>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteConfirmation(selectedProject?._id);
              }}
              color="error"
            >
              <Trash2 size={24} /> Delete
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Add Project Dialog - Owner only */}
      {isOwnerView && (
        <Dialog
          open={openProjectDialog}
          onClose={() => setOpenProjectDialog(false)}
        >
          <DialogTitle>Add New Project</DialogTitle>
          <DialogContent>
            {newProjectImage && (
              <img
                src={newProjectImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProjectImageUpload}
              className="mb-4"
            />
            <TextField
              label="Project Description"
              fullWidth
              multiline
              rows={2}
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProjectDialog(false)}>Cancel</Button>
            <Button
              onClick={handleAddProject}
              className="b text-white"
            >
              Add
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
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
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