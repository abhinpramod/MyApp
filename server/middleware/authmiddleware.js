const jwt = require("jsonwebtoken");
const contractor = require("../model/contractors.model");
const user = require("../model/user.model");
const store = require("../model/store.model");
const dotenv = require("dotenv");
dotenv.config();

const protectRoutecontractor = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    console.log("Contractor Token:", token);

    if (!token) return res.status(401).json({ msg: "Unauthorized: No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ msg: "Unauthorized: Invalid token" });

    const contractordata = await contractor.findById(decoded.Id);
    if (!contractordata) return res.status(401).json({ msg: "Unauthorized: User not found" });

    if (contractordata.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked. Contact admin." });
    }

    req.contractor = contractordata;
    next();
  } catch (error) {
    console.error("Error from protectRoute (contractor):", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const protectRouteuser = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    console.log("User Token:", token);

    if (!token) return res.status(401).json({ msg: "Unauthorized: No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ msg: "Unauthorized: Invalid token" });

    const userdata = await user.findById(decoded.Id);
    if (!userdata) return res.status(401).json({ msg: "Unauthorized: User not found" });

    if (userdata.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked. Contact admin." });
    }

    req.user = userdata;
    next();
  } catch (error) {
    console.error("Error from protectRoute (user):", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const protectRoutestore = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    console.log("Store Token:", token);

    if (!token) return res.status(401).json({ msg: "Unauthorized: No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ msg: "Unauthorized: Invalid token" });

    const storedata = await store.findById(decoded.Id);
    if (!storedata) return res.status(401).json({ msg: "Unauthorized: User not found" });

    if (storedata.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked. Contact admin." });
    }

    req.store = storedata;
    next();
  } catch (error) {
    console.error("Error from protectRoute (store):", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { protectRoutecontractor, protectRouteuser, protectRoutestore };
