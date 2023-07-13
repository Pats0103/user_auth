const User = require("../models/userSchema.js");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "Please fill all the fields",
    });
  }

  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      status: "failed",
      message: "Please enter a valid email",
    });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({
      status: "failed",
      message: "Passwords and confirm_password do not match",
    });
  }

  try {
    const user =  new User({
      name,
      email,
       password,
    });
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Signup successful",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists",
      });
    }
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please fill all the fields",
    });
  }

  try {
      
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "User does not exist",
        });
      }
    
      if (!(await bcrypt.compare(password ,user.password))) {
        return res.status(400).json({
          status: "failed",
          message: "Incorrect password",
        });
      }
    
      const token = user.jwtToken();
      user.password = undefined;
    
      const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      };
    
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            status: "success",
            message: "Signin successful",
            user,
            
        });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }

};

const getuser = async (req, res) => {
    
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        return res.status(200).json({
            status: "success",
            message: "User found",
            user
        });

    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message,
        });

    }
};

const logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            maxAge: 0,
            httpOnly: true,
        });
        res.status(200).json({
            status: "success",
            message: "Logout successful",
        });

    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: error.message,
        });



    }
};
module.exports = {
  signup,
  signin,
  getuser,
  logout
};
