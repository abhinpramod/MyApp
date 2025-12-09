const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateToken = (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, cookieOptions);

  return token;
};



module.exports = {
  generateToken,
 
};