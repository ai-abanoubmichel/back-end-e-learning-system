const mongoose = require("mongoose");

// Create Schema
const courseSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [500, "Minimum price is 500"],
      max: [10000, "Maximum price is 10000"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create Model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
