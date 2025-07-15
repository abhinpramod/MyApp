// controllers/settingsController.js
const Contractor = require("../../model/contractors.model.js");

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    // Update contractor's availability
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { availability },
      { new: true }
    );
const contractorData = contractor.toObject();
delete contractorData.password;

res.status(200).json({
  message: "availability updated successfully",
  contractor: contractorData
});

  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Failed to update availability", error });
  }
};

const updateemployeesnumber = async (req, res) => {
  try {
    const { numberOfEmployees } = req.body;
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { numberOfEmployees },
      { new: true }
    );
const contractorData = contractor.toObject();
delete contractorData.password;

res.status(200).json({
  message: "employees number updated successfully",
  contractor: contractorData
});

  } catch (error) {
    console.error("Error updating number of employees:", error);
    res
      .status(500)
      .json({ message: "Failed to update number of employees", error });
  }
};

const updateDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { description },
      { new: true }
    );

  const contractorData = contractor.toObject();
delete contractorData.password;

res.status(200).json({
  message: "description updated successfully",
  contractor: contractorData
});

  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ message: "Failed to update description", error });
  }
};

module.exports = {
  updateAvailability,
  updateemployeesnumber,
  updateDescription,
};
