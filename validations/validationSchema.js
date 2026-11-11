const { body } = require("express-validator");

const validationSchema = [
  body("course")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Course must be at least 5 characters"),
  body("price")
    .notEmpty()
    .isFloat({ min: 500, max: 10000 })
    .withMessage("Price must be a valid decimal between 500 and 10000"),
];

module.exports = validationSchema;
