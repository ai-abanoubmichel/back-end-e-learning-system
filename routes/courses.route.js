const express = require("express");
const {
  getAllCourses,
  getSingleCourse,
  createNewCoures,
  updataCourse,
  deleteCourse,
} = require("./../controllers/courses.controller.js");
const validationSchema = require("../validations/validationSchema.js");
const authMiddleware = require("../validations/auth.middleware.js");
const roleAuthorize = require("../validations/roleAuthorize.js");
const { ADMIN, MANGER } = require("../utils/userRoles.js");

const router = express.Router();


// get all courses
router.get("/courses", getAllCourses);

// get || update || delete single course
router
  .route("/courses/:courseId")
  .get(getSingleCourse)
  .patch(authMiddleware, updataCourse)
  .delete(authMiddleware, roleAuthorize(ADMIN, MANGER), deleteCourse);

// create new course
router.post("/courses", authMiddleware, validationSchema, createNewCoures);

module.exports = router;
