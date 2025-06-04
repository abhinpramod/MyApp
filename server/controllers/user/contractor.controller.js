// contractor.controller.js
const Contractor = require("../../model/contractors.model.js");
const jobTypes = require("../../model/jobtypes.js");
const Intrests = require("../../model/Intrests.model.js");
const sendEmail = require("../../lib/nodemailer.js");

// Fetch Job Types Controller
const fetchJobTypes = async (req, res) => {
  try {
    const data = await jobTypes.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    return null;
  }
};

// Fetch All Contractors Controller
// In your backend route file (e.g., contractors.js)
const fetchAllContractors = async (req, res) => {
    try {
      const { 
        search = '',
        employeeRange = '',
        availability = 'all',
        jobTypes = [],
        page = 1,
        limit = 5
      } = req.query;
  
      // Convert page and limit to numbers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
  
      // Build the query
      const query = { verified: true, isBlocked: false };
  
      // Search query
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { contractorName: searchRegex },
          { companyName: searchRegex },
          { country: searchRegex },
          { state: searchRegex },
          { city: searchRegex },
          { 'jobTypes': searchRegex }
        ];
      }
  
      // Employee range filter
      if (employeeRange) {
        const [min, max] = employeeRange.split('-').map(Number);
        query.numberOfEmployees = { $gte: min };
        if (max !== Infinity) {
          query.numberOfEmployees.$lte = max;
        }
      }
  
      // Availability filter
      if (availability !== 'all') {
        query.availability = availability === 'available';
      }
  
      // Job types filter
      if (jobTypes.length > 0) {
        query.jobTypes = { $in: jobTypes };
      }
  
      // Get total count for pagination
      const total = await Contractor.countDocuments(query);
  
      // Get paginated results
      const contractors = await Contractor.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        contractors,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total
      });
    } catch (error) {
      console.error("fetchAllContractors error:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  };

// Fetch Contractor by ID Controller
const fetchContractorById = async (req, res) => {
  const _id = req.params.id;
  console.log("in control", _id);

  try {
    const data = await Contractor.findOne({ _id });
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Add Interests Controller
const addInterests = async (req, res) => {
  const contractorId = req.params.id;
  const contractor = req.body.contractor;
  const { _id, name, email } = req.user;
  console.log('request bodey',req.body);
  const { phoneNumber, address, expectedDate, jobTypes } = req.body.formData;
  console.log(_id);


  try {
    const newinterests = new Intrests({
      contractorId,
      userId: _id,
      phoneNumber,
      address,
      expectedDate,
      jobTypes,
      name,
      email,
      contractorName:contractor.contractorName,
      contractorEmail:contractor.email,
      companyName : contractor.companyName
    });
    await newinterests.save();
  
    const to = contractor.email;
    const subject = "New Interests Added";
    const msg = `Name:${name}\nPhone Number:${phoneNumber}\nAddress:${address}\nExpected Date:${expectedDate}\nJob Types:${jobTypes}`;

    sendEmail(to, subject, msg);
    res.status(200).json({ msg: "Interests sent to contractor" });
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Fetch All Interests Controller
const fetchAllInterests = async (req, res) => {
  try {
    const data = await Intrests.find({userId : req.user._id});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  fetchJobTypes,
  fetchAllContractors,
  fetchContractorById,
  addInterests,
  fetchAllInterests
};