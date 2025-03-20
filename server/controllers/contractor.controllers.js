const Contractor = require("../model/contractors.model.js");
const TempContractor = require("../model/tempcontractor.model.js");
const OTP = require("../model/otp.model.js");
const bcrypt = require("bcrypt");
const {generateTokencontractor} = require("../lib/utils.js");
const generateOTP = require("../lib/otpgenarator");
const sendEmail = require("../lib/nodemailer");
const cloudinary = require("../lib/cloudinary"); // Cloudinary config
const multer = require("multer");
const jobTypes = require("../model/jobtypes.js");
const interests = require("../model/Intrests.model.js");

// Multer setup for Cloudinary (used by other controllers)
const storage = require("multer-storage-cloudinary").CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "contractor_docs", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "pdf"],
  },
});

const upload = multer({ storage }); // Existing Multer instance for other controllers

// Separate Multer setup for addProject (in-memory file handling)
const memoryStorage = multer.memoryStorage(); // Store files in memory as buffers

// Configure Multer with limits for addProject
const uploadForProjects = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
    fieldSize: 10 * 1024 * 1024, // 10 MB field size limit (for description)
  },
});

// Controller function for second-step registration
const registerstep2 = async (req, res) => {
  console.log("registerstep2");
  console.log("Files received:", req.files);

  try {
    console.log('params', req.params);
    const { id } = req.params;
    const { gstNumber } = req.body;
    console.log('params id', id);

    // Check if the contractor exists
    const contractor = await Contractor.findById(id);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Upload files to Cloudinary
    let gstDocUrl = "";
    let licenseDocUrl = "";

    if (req.files && req.files["gstDocument"] && req.files["gstDocument"][0]) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files["gstDocument"][0].mimetype};base64,${req.files["gstDocument"][0].buffer.toString("base64")}`,
        {
          folder: "contractor_docs",
        }
      );
      gstDocUrl = result.secure_url;
    }

    if (req.files && req.files["licenseDocument"] && req.files["licenseDocument"][0]) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files["licenseDocument"][0].mimetype};base64,${req.files["licenseDocument"][0].buffer.toString("base64")}`,
        {
          folder: "contractor_docs",
        }
      );
      licenseDocUrl = result.secure_url;
    }

    // Update contractor details in MongoDB
    contractor.gstNumber = gstNumber;
    contractor.gstDocument = gstDocUrl;
    contractor.licenseDocument = licenseDocUrl;
    contractor.registrationStep = 2;
    contractor.approvalStatus = "Pending";
    contractor.verified = false; // Mark as pending verification

    await contractor.save();

    res.status(200).json({ message: "Step 2 registration completed", contractor });
  } catch (error) {
    console.error("error from registerstep2", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Add project controller
const addProject = async (req, res) => {
  try {
    const contractorId = req.contractor._id;

    if (!req.body.image || !req.body.description) {
      return res.status(400).json({ message: "Image and description are required" });
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

// Other controllers remain unchanged
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);

  try {
    const contractor = await Contractor.findOne({ email });
    if (!contractor) return res.status(400).json({ msg: "Invalid Email" });

    if (contractor.isBlocked)
      return res.status(403).json({ msg: "your account  is blocked connect with admin." });

    const isMatch = await bcrypt.compare(password, contractor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateTokencontractor(contractor._id, res);
    res.status(200).json(contractor);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
 


const handleDeleteProject = async (req, res) => {
  const projectId = req.body.projectId;

  try {
    const contractor = await Contractor.findById(req.contractor._id);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    const projectToDelete = contractor.projects.find((project) => project._id.toString() === projectId);
    if (!projectToDelete) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete image from Cloudinary
    if (projectToDelete.imagePublicId) {
      const cloudinaryResponse = await cloudinary.uploader.destroy(projectToDelete.imagePublicId);
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



const registerstep1 = async (req, res) => {
  const {
    email,
    password,
    contractorName,
    companyName,
    country,
    state,
    city,
    phone,
    jobTypes,
    numberOfEmployees,
  } = req.body;
  console.log(req.body);

  try {
    if (
      !contractorName ||
      !email ||
      !password ||
      !companyName ||
      !country ||
      !state ||
      !city ||
      !phone ||
      !jobTypes ||
      !numberOfEmployees
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Save temporary contractor data
    const tempContractor = new TempContractor({
      contractorName,
      email,
      password: hashPassword,
      companyName,
      country,
      state,
      city,
      phone,
      jobTypes,
      numberOfEmployees,
    });
    await tempContractor.save();

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    // Send OTP to email
    console.log(email, "Your OTP for Verification", `Your OTP is: ${otp}`);

    await sendEmail(
      email,
      "Your OTP for Verification",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({ msg: "OTP sent to your email for verification" });
  } catch (error) {
    console.log("Error from register:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Retrieve OTP and temporary contractor data
    const otpRecord = await OTP.findOne({ email });
    const tempContractor = await TempContractor.findOne({ email });
    console.log(otpRecord, tempContractor);
    if (!otpRecord || !tempContractor) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // Compare OTPs
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save the contractor data to the database
    const newContractor = new Contractor({
      contractorName: tempContractor.contractorName,
      email: tempContractor.email,
      password: tempContractor.password,
      companyName: tempContractor.companyName,
      country: tempContractor.country,
      state: tempContractor.state,
      city: tempContractor.city,
      phone: tempContractor.phone,
      jobTypes: tempContractor.jobTypes,
      numberOfEmployees: tempContractor.numberOfEmployees,
    });
    await newContractor.save();
    console.log("New contractor saved:", newContractor);

    // Clear temporary data
    await OTP.deleteOne({ email });
    await TempContractor.deleteOne({ email });
    console.log("Temporary data deleted for email:", email);

    res.status(200).json({
      _id: newContractor._id,
      contractorName: newContractor.contractorName,
      email: newContractor.email,
      companyName: newContractor.companyName,
      country: newContractor.country,
      state: newContractor.state,
      city: newContractor.city,
      phone: newContractor.phone,
      jobTypes: newContractor.jobTypes,
      numberOfEmployees: newContractor.numberOfEmployees,
      message: " registered successfully wait for admin approval",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const contractorprofile = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.contractor._id);
    if (!contractor) {
      return res.status(404).json({ msg: "Contractor not found" });
    }
    res.status(200).json(contractor);
  } catch (error) {
    console.log("Error from contractorprofile:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    console.log("controll", req.contractor);
    res.status(200).json(req.contractor);
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const logoutcontractor = (req, res) => {
  try {
    res.clearCookie("jwtcontractor");
    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.log("Error from logoutcontractor:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
}
 const fectchjobtypes = async (req, res) => {
  try {
   const data= await jobTypes.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}


const updateAvailability = async (req, res) => {
  console.log('updateAvailability');

  try {
    const { availability } = req.body;

    // Update contractor's availability
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { availability },
      { new: true }
    );
    console.log(contractor);

    res.status(200).json({ message: 'Availability updated successfully', contractor });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Failed to update availability', error });
  }
};

const updateemployeesnumber = async (req, res) => {
  try {
    const { numberOfEmployees } = req.body;
    console.log(numberOfEmployees);
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { numberOfEmployees },
      { new: true }
    );

    res.status(200).json({ message: 'Number of employees updated successfully', contractor });
  } catch (error) {
    console.error('Error updating number of employees:', error);
    res.status(500).json({ message: 'Failed to update number of employees', error });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const contractorId = req.contractor._id; 
    console.log("Contractor ID:", contractorId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Fetch contractor data
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Delete old profile picture from Cloudinary if it exists
    if (contractor.profilePicturePublicId) {
      console.log("Old profile picture public ID:", contractor.profilePicturePublicId);
      await cloudinary.uploader.destroy(contractor.profilePicturePublicId);
      console.log("Old profile picture deleted from Cloudinary");
    }

    // Upload new profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_pictures",
        resource_type: "image",
      }
    );

    console.log("Profile picture uploaded:", result);

    // Update contractor profile picture fields **without triggering full validation**
    await Contractor.findByIdAndUpdate(
      contractorId,
      {
        profilePicture: result.secure_url,
        profilePicturePublicId: result.public_id,
      },
      { new: true, runValidators: false } // Disable full validation to prevent the `projects.id` issue
    );

    res.status(200).json({ message: "Profile picture updated successfully",contractor });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: "Failed to upload profile picture", error });
  }
};

const fectchintrestes   = async (req, res) => {
  const {_id}=req.contractor
  try {
   const data= await interests.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}


const markseen = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  
  try {
    const interest = await interests.findOneAndUpdate({ _id: id }, { $set: { seeenByContractor: true } }, { new: true });
   
 
    res.status(200).json({ msg: "Interest marked as seen" });
  } catch (error) {
    console.error("Error marking interest as seen:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  login,
  registerstep1,
  verifyOTP,
  registerstep2,
  upload,
  checkAuth,
  contractorprofile,
  updateAvailability,
  updateemployeesnumber,
  uploadProfilePic,
  addProject,
  uploadForProjects,
  logoutcontractor,
  handleDeleteProject,
  fectchjobtypes ,
  fectchintrestes,
  markseen
};