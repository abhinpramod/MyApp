const Contractor = require("../../model/contractors.model.js");
const cloudinary = require("../../lib/cloudinary.js");

// Upload media files
const uploadProjectMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "contractor_projects",
            resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
          }
        );
        return {
          url: result.secure_url,
          publicId: result.public_id,
          type: file.mimetype.startsWith('video') ? 'video' : 'image'
        };
      })
    );

    res.status(200).json({ 
      message: "Media uploaded successfully",
      mediaUrls: uploadResults 
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ message: "Failed to upload media", error });
  }
};

// Add new project
const addProject = async (req, res) => {
  try {
    const { description, media } = req.body;
    const contractorId = req.contractor._id;

    if (!description || !media || media.length === 0) {
      return res.status(400).json({ message: "Description and media are required" });
    }

    const newProject = {
      description,
      media: media.map(item => ({
        url: item.url,
        type: item.type,
        publicId: item.publicId
      })),
      createdAt: new Date()
    };

    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      { $push: { projects: newProject } },
      { new: true }
    );

    res.status(201).json({
      message: "Project added successfully",
      project: contractor.projects[contractor.projects.length - 1]
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Failed to add project", error });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.contractor._id)
      .select("projects")
      .lean();

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    res.status(200).json({ projects: contractor.projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const contractor = await Contractor.findById(req.contractor._id);

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    const project = contractor.projects.id(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete media from Cloudinary
    await Promise.all(
      project.media.map(async (mediaItem) => {
        try {
          await cloudinary.uploader.destroy(mediaItem.publicId, {
            resource_type: mediaItem.type === 'video' ? 'video' : 'image'
          });
        } catch (error) {
          console.error(`Error deleting media ${mediaItem.publicId}:`, error);
        }
      })
    );

    // Remove project
    contractor.projects.pull(projectId);
    await contractor.save();

    res.status(200).json({ 
      message: "Project deleted successfully",
      projects: contractor.projects 
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project", error });
  }
};

module.exports = {
  uploadProjectMedia,
  addProject,
  getProjects,
  deleteProject
};