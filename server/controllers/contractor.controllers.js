const Contractor = require("../model/contractors.model.js");
const bcrypt = require("bcrypt");
const generateToken = require("../lib/utils.js");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const contractor = await Contractor.findOne({ email });
    if (!contractor) return res.status(400).json({ msg: "Invalid Email" });

    if (contractor.isBlocked)
      return res.status(403).json({ msg: "contractor  is blocked" });

    const isMatch = await bcrypt.compare(password, contractor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateToken(contractor._id, res);
    res.status(200).json({
      _id: contractor._id,
      contractorname: contractor.contractorname,
      email: contractor.email,
      companyName: contractor.companyName,
      location: contractor.location,
      phone: contractor.phone,
      jobType: contractor.jobType,
      employees: contractor.employees,
      profilePicture: contractor.profilePicture,
      gstNumber: contractor.gstNumber,
      gstDocument: contractor.gstDocument,
      licenseDocument: contractor.licenseDocument,
      registrationStep: contractor.registrationStep,
      verified: contractor.verified,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const register = async (req, res) => {
  const {
    email,
    password,
    contractorName,
    companyName,
    location,
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
      !location ||
      !phone ||
      !jobTypes ||
      !numberOfEmployees
    ) {
      return res.status(400).json({ message: "All fields are required man" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await Contractor.findOne({ email });
    if (user) return res.status(400).json({ msg: "email already exists" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);


    

    const newcontractor = new Contractor({
      contractorName,
      email,
      password: hashPassword,
      isBlocked: false,
      companyName,
      location,
      phone,
      jobTypes,
      numberOfEmployees,
    });

    await newcontractor.save(); // Save the admin

    return res.status(200).json({
      _id: newcontractor._id,
      contractorName: newcontractor.contractorName,
      email: newcontractor.email,
      companyName: newcontractor.companyName,
      location: newcontractor.location,
      phone: newcontractor.phone,
      jobTypes: newcontractor.jobTypes,
      numberOfEmployees: newcontractor.numberOfEmployees,
    });
  } catch (error) {
    console.log("Error from register:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { login, register };
