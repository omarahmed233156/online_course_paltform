const { body } = require("express-validator");

exports.registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 60 }).withMessage("Name is too long"),
  body("email").trim().toLowerCase().isEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["instructor", "student"]).withMessage("Role must be instructor or student"),
];

exports.loginRules = [
  body("email").trim().toLowerCase().isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];