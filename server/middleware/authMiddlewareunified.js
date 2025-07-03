// authMiddleware.js
const jwt = require("jsonwebtoken");
const contractor = require("../model/contractors.model");
const user = require("../model/user.model");
const store = require("../model/store.model");
const dotenv = require("dotenv");
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized   : No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }

    // Check all user types
    const [contractordata, userdata, storedata] = await Promise.all([
      contractor.findById(decoded.Id),
      user.findById(decoded.Id),
      store.findById(decoded.Id)
    ]);

    let authenticatedUser = null;
    let userType = null;

    if (contractordata) {
      if (contractordata.isBlocked) {
        return res.status(403).json({ msg: "Your contractor account is blocked. Please contact admin." });
      }
      authenticatedUser = contractordata;
      userType = 'contractor';
    } else if (userdata) {
      if (userdata.isBlocked) {
        return res.status(403).json({ msg: "Your user account is blocked. Please contact admin." });
      }
      authenticatedUser = userdata;
      userType = 'user';
    } else if (storedata) {
      if (storedata.isBlocked) {
        return res.status(403).json({ msg: "Your store account is blocked. Please contact admin." });
      }
      authenticatedUser = storedata;
      userType = 'store';
    } else {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    req.user = authenticatedUser;
    req.userType = userType;
    next();
  } catch (error) {
    console.error("Error from protectRoute:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { protectRoute };