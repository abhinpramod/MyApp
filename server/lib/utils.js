const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateTokencontractor = async (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",                                 // ✅ VERY IMPORTANT for cross-site cookies

    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

const generateTokenuser = async (Id, res) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);  // Optional debug
  const token = jwt.sign({ Id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",                                 // ✅ VERY IMPORTANT for cross-site cookies

    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

const generateTokenstore = async (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",                                 // ✅ VERY IMPORTANT for cross-site cookies

    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

module.exports = { generateTokencontractor, generateTokenuser, generateTokenstore };
