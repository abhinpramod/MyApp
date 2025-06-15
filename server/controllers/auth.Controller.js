// authController.js
const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
      userType: req.userType
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { checkAuth };