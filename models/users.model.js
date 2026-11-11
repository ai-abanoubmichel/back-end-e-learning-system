const mongoose = require("mongoose");
const validator = require("validator");
const { ADMIN, USER, MANGER } = require("../utils/userRoles.js");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "enter vaild Email"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ADMIN, USER, MANGER],
      default: USER,
    },
    avatar: {
      type: String,
      default: "/uploads/avatar-default-svgrepo-com.svg",
    },
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
