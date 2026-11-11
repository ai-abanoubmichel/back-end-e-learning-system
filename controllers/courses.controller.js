// const { courses } = require("./../api/courses.js");
const { validationResult } = require("express-validator");
const Course = require("./../models/courses.model.js");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText.js");

// get all courses
const getAllCourses = async (req, res) => {
  // Pagination
  const query = req.query;
  const limit = Math.max(1, Number(query.limit) || 10);
  const page = Math.max(1, Number(query.page) || 1);
  const skip = (page - 1) * limit;

  const courses = await Course.find().limit(limit).skip(skip);
  res.json({ status: SUCCESS, data: { courses } });
};

// get single course
const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: FAIL,
        message: "Course not found",
        data: { course: null },
      });
    }

    res.status(200).json({
      status: SUCCESS,
      data: { course },
    });
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: "Invalid course ID format",
    });
  }
};

// create new course
const createNewCoures = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: ERROR, message: errors.array() });
  }
  // const course = { id: courses.length + 1, ...req.body };
  // courses.push(course);

  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: SUCCESS, data: { course: newCourse } });
};

// updata the course
const updataCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findByIdAndUpdate(courseId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        status: FAIL,
        data: {
          message: "Course not found",
        },
      });
    }

    res.status(200).json({
      status: SUCCESS,
      data: { course },
    });
  } catch (error) {
    // Mongoose Validation Error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        status: FAIL,
        message: "Validation failed",
        errors,
      });
    }

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: FAIL,
        message: "Invalid data format",
        errors: [
          {
            field: error.path,
            message: error.message,
          },
        ],
      });
    }

    // Other Server Errors
    console.error(error);

    return res.status(500).json({
      status: ERROR,
      message: "Internal Server Error",
    });
  }
};

// delete the coures
const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    return res.status(200).json({
      status: SUCCESS,
      message: "Course deleted successfully",
    });
  }

  return res.status(200).json({
    status: SUCCESS,
    message: "Course deleted successfully",
  });
};

module.exports = {
  getAllCourses,
  getSingleCourse,
  createNewCoures,
  updataCourse,
  deleteCourse,
};
