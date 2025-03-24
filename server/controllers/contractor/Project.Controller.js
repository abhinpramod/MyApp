// controllers/projectController.js
const Contractor = require("../../model/contractors.model.js");
const cloudinary = require("../../lib/cloudinary");

const addProject = async (req, res) => {
  try {
    const contractorId = req.contractor._id;

    if (!req.body.image || !req.body.description) {
      return res
        .status(400)
        .json({ message: "Image and description are required" });
    }

    if (req.body.description.length > 10000) {
      return res.status(400).json({ message: "Description is too long" });
    }

    // Upload image directly to Cloudinary
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: "contractor_projects",
      resource_type: "image",
    });

    console.log("Image uploaded:", result);

    // Update contractor's projects array
    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      {
        $push: {
          projects: {
            image: result.secure_url,
            description: req.body.description,
            imagePublicId: result.public_id,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Project added successfully",
      project: {
        image: result.secure_url,
        description: req.body.description,
        _id: contractor.projects[contractor.projects.length - 1]._id, // Returning ID for frontend
      },
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Failed to add project", error });
  }
};

const handleDeleteProject = async (req, res) => {
  const projectId = req.body.projectId;

  try {
    const contractor = await Contractor.findById(req.contractor._id);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    const projectToDelete = contractor.projects.find(
      (project) => project._id.toString() === projectId
    );
    if (!projectToDelete) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete image from Cloudinary
    if (projectToDelete.imagePublicId) {
      const cloudinaryResponse = await cloudinary.uploader.destroy(
        projectToDelete.imagePublicId
      );
      console.log("Cloudinary response:", cloudinaryResponse);
      if (cloudinaryResponse.result !== "ok") {
        console.warn("Cloudinary image deletion may have failed.");
      }
    }

    // Remove project from contractor's projects array
    const updatedContractor = await Contractor.findByIdAndUpdate(
      req.contractor._id,
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Project and image deleted successfully",
      projects: updatedContractor.projects, // Returning updated project list
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

module.exports = {
  addProject,
  handleDeleteProject,
};