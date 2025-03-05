import { useState, useEffect } from "react";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import Switch from "@/components/ui/switch";
import { Camera, Trash2, CirclePlus, X, Pencil, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios"; // Import axios for API calls
import axiosInstance from "../../lib/axios";


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

  // Fetch contractor data on component mount
  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        const response = await axiosInstance.get("/contractor/profile");
        setContractor(response.data);
        setAvailability(response.data.availability);
        setProfilePic(response.data.profilePic);
        setProjects(response.data.projects || []);
        setNumberOfEmployees(response.data.numberOfEmployees);
      } catch (error) {
        toast.error("Failed to fetch contractor data");
      }
    };

    fetchContractorData();
  }, []);

  // Update availability
  const handleAvailabilityChange = async (checked) => {
    try {
      await axiosInstance.put("/contractor/availability", {
        availability: checked,
      });
      setAvailability(checked);
      toast.success(
        `Availability set to ${checked ? "Available" : "Not Available"}`
      );
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  // Update profile picture
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axiosInstance.put(
        "/contractor/profilePic",formData

      
      );
      setProfilePic(response.data.profilePic);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
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
        const response = await axiosInstance.post(
          `/contractor/projects${loginedId}`,
          formData
        
          
         
        );
        setProjects([...projects, response.data]);
        toast.success("Project added successfully!");
        setOpenProjectDialog(false);
        setNewProjectImage(null);
        setNewProjectDescription("");
      } catch (error) {
        toast.error("Failed to add project");
      }
    } else {
      toast.error("Please provide both an image and a description");
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    try {
      await axiosInstance.delete(`/contractor/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  // Update number of employees
  const handleSaveEmployees = async () => {
    try {
      await axiosInstance.put(`/contractor/employees${loginedId}`, {
        numberOfEmployees,
      });
      setIsEditingEmployees(false);
      toast.success("Number of employees updated successfully!");
    } catch (error) {
      toast.error("Failed to update number of employees");
    }
  };

  return (
    <div className="p-6 h-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="relative">
            <Avatar
              className="w-24 h-24 rounded-full border-2 border-gray-200"
              src={profilePic}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
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
                  className="w-20"
                />
                <IconButton
                  onClick={handleSaveEmployees}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Save />
                </IconButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{numberOfEmployees}</span>
                <IconButton
                  onClick={() => setIsEditingEmployees(true)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Pencil />
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
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <CirclePlus size={18} /> Add Project
      </Button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="relative cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <CardContent>
              <img
                src={project.image}
                alt={`Project ${index + 1}`}
                className="w-full h-28 object-cover rounded-lg"
              />
              <p className="text-center text-sm mt-2 text-gray-600">
                {project.description}
              </p>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
              >
                <Trash2 size={18} />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-2xl w-full p-4 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProject(null)}
            >
              <X size={24} />
            </button>
            <img
              src={selectedProject.image}
              alt="Selected Project"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-center text-lg mt-4 text-gray-600">
              {selectedProject.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorProfile;