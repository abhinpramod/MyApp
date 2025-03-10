import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Avatar,
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
import Switch from "../../components/ui/switch";

// Confirmation Dialog Component
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ContractorProfile = () => {
  const [contractor, setContractor] = useState({
    companyName: "",
    contractorName: "",
    email: "",
    phone: "",
    location: "",
    availability: false,
    profilePic: "",
    projects: [],
    gstNumber: "",
    country: "",
    state: "",
    city: "",
    address: "",
    numberOfEmployees: 0,
    description: "",
  });

  const [availability, setAvailability] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [newProjectImage, setNewProjectImage] = useState(null);
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [numberOfEmployees, setNumberOfEmployees] = useState(0);
  const [isEditingEmployees, setIsEditingEmployees] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch contractor data on component mount
  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/contractor/profile");
        setContractor(response.data);
        setAvailability(response.data.availability);
        setProfilePic(response.data.profilePic);
        setProjects(response.data.projects || []);
        setNumberOfEmployees(response.data.numberOfEmployees);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to fetch contractor data");
      }
    };

    fetchContractorData();
  }, []);

  // Update availability
  const handleAvailabilityChange = async (checked) => {
    setIsLoading(true);
    try {
      await axiosInstance.put("/contractor/availability", {
        availability: checked,
      });
      setAvailability(checked);
      setIsLoading(false);
      toast.success(
        `Availability set to ${checked ? "Available" : "Not Available"}`
      );
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to update availability");
    }
  };

  // Update profile picture
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
      const response = await axiosInstance.put(
        "/contractor/updateProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfilePic(response.data.profilePicture);
      setIsLoading(false);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to update profile picture");
    }
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

  // Add project
  const handleAddProject = async () => {
    if (newProjectImage && newProjectDescription) {
      const formData = new FormData();
      formData.append("image", newProjectImage);
      formData.append("description", newProjectDescription);

      try {
        setIsLoading(true);
        const response = await axiosInstance.post(
          "/contractor/addprojects",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProjects([...projects, response.data.project]);
        toast.success("Project added successfully!");
        setOpenProjectDialog(false);
        setNewProjectImage(null);
        setNewProjectDescription("");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to add project");
      }
    } else {
      toast.error("Please provide both an image and a description");
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      setIsLoading(true);
      console.log("Deleting project with ID:", projectId); // Debugging

      // Send the projectId in the request body
      const response = await axiosInstance.delete("/contractor/deleteproject", {
        data: { projectId }, // Ensure the backend expects projectId in the request body
      });

      console.log("Backend response:", response.data); // Debugging

      // Update the state to remove the deleted project
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );

      setIsLoading(false);
      toast.success("Project deleted successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting project:", error); // Debugging
      toast.error("Failed to delete project");
    }
  };

  // Open delete confirmation dialog
  const openDeleteConfirmation = (projectId) => {
    console.log("Setting projectToDelete:", projectId); // Debugging
    setProjectToDelete(projectId);
    setDeleteConfirmationOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    console.log("Confirming deletion for project ID:", projectToDelete); // Debugging

    if (projectToDelete) {
      handleDeleteProject(projectToDelete);
      setSelectedProject(null); // Close the zoomed view after deletion
    } else {
      console.error("No project ID found for deletion"); // Debugging
      toast.error("No project selected for deletion");
    }

    setDeleteConfirmationOpen(false);
  };

  // Update number of employees
  const handleSaveEmployees = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/contractor/employeesnumber", {
        numberOfEmployees,
      });
      setIsEditingEmployees(false);
      setIsLoading(false);
      toast.success("Number of employees updated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to update number of employees");
    }
  };

  if (isLoading) {
    return (
      <center>
        <Loader className="size-10 mt-60 animate-spin" />
      </center>
    );
  }

  return (
    <div className="p-6 mt-5 max-h-fit min-h-screen max-w-4xl mx-auto shadow-lg rounded-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="relative">
            <Avatar
              sx={{ width: 128, height: 128 }}
              className=" rounded-full border-4 border-gray-200" // Increased size here
              src={profilePic || contractor.profilePicture}
            />

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 bg-gray-800  p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <Camera className="w-5  h -5 *: text-white" />{" "}
              {/* Slightly larger icon */}
              <input
                type="file"
                id="avatar-upload"
                name="profilePic"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicUpload}
              />
            </label>
          </div>
          <h2 className="text-xl font-bold mt-4">{contractor.companyName}</h2>
          <h4 className="font-semibold text-gray-600">
            {contractor.contractorName}
          </h4>
          <p className="text-gray-500 text-center mt-2">
            {contractor.description}
          </p>
        </div>

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
          <div className="flex items-center gap-2">
            <strong>Number of Employees:</strong>
            {isEditingEmployees ? (
              <div className="flex items-center gap-2">
                <TextField
                  type="number"
                  value={numberOfEmployees}
                  onChange={(e) => setNumberOfEmployees(e.target.value)}
                  size="small"
                  className="w-16"
                />
                <IconButton
                  onClick={handleSaveEmployees}
                  className=" hover:dark text-white"
                >
                  <Save size={15} />
                </IconButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{numberOfEmployees}</span>
                <IconButton
                  onClick={() => setIsEditingEmployees(true)}
                  className="hover:bg-black"
                >
                  <Pencil size={15} />
                </IconButton>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Switch
              checked={availability}
              onCheckedChange={handleAvailabilityChange}
            />
            <span className={availability ? "text-green-600" : "text-red-600"}>
              {availability ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />
      <Button
        onClick={() => setOpenProjectDialog(true)}
        className="flex items-center gap-2text-sm font-semibold  hover:text-gray-800 transition-colors"
      >
        <CirclePlus size={18} /> Add Project
      </Button>

      {/* Project List using MUI Grid and Card */}
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
                  image={project.image}
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

      {/* Add Project Dialog */}
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
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

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
              src={selectedProject?.image}
              alt="Selected Project"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <p className="text-center text-lg mt-4 text-gray-600">
              {selectedProject?.description}
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Added on: {new Date(selectedProject?.createdAt).toLocaleString()}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteConfirmation(selectedProject?._id);
              console.log(selectedProject);
            }}
            color="error"
          >
            <Trash2 size={24} /> Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </div>
  );
};

export default ContractorProfile;
