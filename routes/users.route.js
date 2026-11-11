const express = require("express");
const router = express.Router();
const upload = require("../validations/upload.middleware.js");
const {
  getAllUsers,
  userRegister,
  userLogin,
} = require("../controllers/users.controller.js");
const authMiddleware = require("../validations/auth.middleware.js");

// get all users
router.get("/", authMiddleware, getAllUsers);

// register
router.post("/register", upload.single("avatar"), userRegister);

// login
router.post("/login", userLogin);

module.exports = router;
