// controllers/utilityController.js
const jobTypes = require("../../model/jobtypes.js");
const interests = require("../../model/Intrests.model.js");

const fectchjobtypes = async (req, res) => {
  try {
    const data = await jobTypes.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const fectchintrestes = async (req, res) => {
  const { _id } = req.contractor;
  try {
    const data = await interests.find({ contractorId: _id });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const markseen = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const interest = await interests.findOneAndUpdate(
      { _id: id },
      { $set: { seenByContractor: true } },
      { new: true }
    );

    res.status(200).json({ msg: "Interest marked as seen" });
  } catch (error) {
    console.error("Error marking interest as seen:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const numberofnotification = async (req, res) => {
  const { _id } = req.contractor;
  try {
    const data = await interests.find({ contractorId: _id, seenByContractor: false });
    res.status(200).json(data.length);
  } catch (error) {
    console.error("Error fetching job types:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  fectchjobtypes,
  fectchintrestes,
  markseen,
  numberofnotification
};