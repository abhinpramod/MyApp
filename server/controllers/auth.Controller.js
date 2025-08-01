// authController.js
const checkAuth = (req, res) => {
  try {
   const user = req.user.toObject();
delete user.password;


    res.status(200).json({
      user,
      userType: req.userType
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


module.exports = { checkAuth };