const express= require('express')
const router = express.Router();
const {register,login}= require("../controllers/contractor.controllers");
// const { protectRoute } = require("../middleware/authmiddleware");


router.post("/register1ststep", register);
router.post("/login", login);


module.exports = router;  