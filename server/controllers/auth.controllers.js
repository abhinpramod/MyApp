const  User = require ("../model/user.model.js");
const bcrypt = require("bcrypt");
const   generateToken =require ("../lib/utils.js" )




const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid Email" });
    
      if (user.isBlocked) return res.status(403).json({ msg: "User is blocked" });
    
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid password" });
    
      generateToken(user._id, res);
      res.status(200).json({
        
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        uniqueId: user.uniqueId
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
    };

    const register = async (req, res) => {
        const { email, password, name, uniqueId} = req.body;
        console.log(req.body);  
        
      
        try {
            if (!name || !email || !password ) {
                return res.status(400).json({ message: "All fields are required man" });
            }
      
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters" });
            }
      
            const user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "user already exists" });
      
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            
            const newuser = new User({
                name,
                email,
                password: hashPassword,
                isBlocked: false,
                uniqueId: uniqueId
            });
      
            await newuser.save(); // Save the admin
          
      
            return res.status(200).json({
                _id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                uniqueId: newuser.uniqueId
            });
      
        } catch (error) {
            console.log("Error from register:", error.message);
            res.status(500).json({ msg: "Internal server error" });
        }
      }



module.exports = { login,register };