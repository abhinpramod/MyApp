const jwt = require("jsonwebtoken");

const User = require("../model/user.model");


const protectRouteuser = async (req, res, next) => {
  console.log('protectRoute');
  
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JwT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error from protectRoute", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { protectRouteuser };
