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

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { 
      verified: true, 
      isBlocked: false 
    };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { contractorName: searchRegex },
        { companyName: searchRegex },
        { country: searchRegex },
        { state: searchRegex },
        { city: searchRegex },
        { jobTypes: searchRegex }
      ];
    }

    if (employeeRange && employeeRange.trim() !== '') {
      const [min, max] = employeeRange.split('-').map(Number);
      query.numberOfEmployees = { $gte: min };
      if (!isNaN(max)) {
        query.numberOfEmployees.$lte = max;
      }
    }

    if (availability && availability !== 'all') {
      query.availability = availability === 'available';
    }

    if (jobTypes && jobTypes.length > 0) {
      const typesArray = Array.isArray(jobTypes) ? jobTypes : [jobTypes];
      query.jobTypes = { $in: typesArray };
    }

    const total = await Contractor.countDocuments(query);

    const contractors = await Contractor.find(query)
      .select('-password') 
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

  try {
const data = await Contractor.findOne({ _id }).select('-password');
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
  const { phoneNumber, address, expectedDate, jobTypes } = req.body.formData;


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