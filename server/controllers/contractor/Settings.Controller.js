// controllers/settingsController.js
const Contractor = require("../../model/contractors.model.js");

const updateAvailability = async (req, res) => {
  console.log("updateAvailability");

  try {
    const { availability } = req.body;

    // Update contractor's availability
    const contractor = await Contractor.findByIdAndUpdate(
      req.contractor._id, // Assuming you're using authentication middleware
      { availability },
      { new: true }
    );
    console.log(contractor);

    res
      .status(200)
      .json({ message: "Availability updated successfully", contractor });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Failed to update availability", error });
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

    res
      .status(200)
      .json({
        message: "Number of employees updated successfully",
        contractor,
      });
  } catch (error) {
    console.error("Error updating number of employees:", error);
    res
      .status(500)
      .json({ message: "Failed to update number of employees", error });
  }
};

module.exports = {
  updateAvailability,
  updateemployeesnumber,
};