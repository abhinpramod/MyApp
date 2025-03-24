const jwt = require("jsonwebtoken");

const generateTokencontractor = async (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JwT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
const generateTokenuser = async (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JwT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
const generateTokenstore = async (Id, res) => {
  const token = jwt.sign({ Id }, process.env.JwT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};

module.exports ={generateTokencontractor,generateTokenuser,generateTokenstore};
