// const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("./../models/users.model.js");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText.js");
const generateToken = require("../utils/generateToken.js");

// ==========================
// Get All Users
// ==========================
const getAllUsers = async (req, res) => {
  try {
    // console.log(req.headers);
    const users = await User.find();
    res.status(200).json({
      status: SUCCESS,
      results: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: error.message,
    });
  }
};

// ==========================
// Register
// ==========================
const userRegister = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: FAIL,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        status: FAIL,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      status: SUCCESS,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          avatar: newUser.avatar,
          token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: error.message,
    });
  }
};

// ==========================
// Login
// ==========================
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: FAIL,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: FAIL,
        message: "invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: FAIL,
        message: "invaild email or password",
      });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: SUCCESS,
      message: "Login successful",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: ERROR,
      message: error.message,
    });
  }
};

module.exports = { getAllUsers, userRegister, userLogin };
