// controllers/registrationController.js
const Contractor = require("../../model/contractors.model.js");
const cloudinary = require("../../lib/cloudinary.js");

const registerstep2 = async (req, res) => {

  try {
    
    const  id  = req.contractor._id;   
    const { gstNumber } = req.body;


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
        `data:${req.files["gstDocument"][0].mimetype};base64,${req.files[
          "gstDocument"
        ][0].buffer.toString("base64")}`,
        {
          folder: "contractor_docs",
        }
      );
      gstDocUrl = result.secure_url;
    }

    if (
      req.files &&
      req.files["licenseDocument"] &&
      req.files["licenseDocument"][0]
    ) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files["licenseDocument"][0].mimetype};base64,${req.files[
          "licenseDocument"
        ][0].buffer.toString("base64")}`,
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
const contractorData = contractor.toObject();
delete contractorData.password;

res.status(200).json({
  message: "Step 2 registration completed, wait for admin approval",
  contractor: contractorData
});

  } catch (error) {
    console.error("error from registerstep2", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  registerstep2,
};