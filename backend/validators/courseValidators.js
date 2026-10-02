const { body, query } = require("express-validator");

exports.createCourseRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }).withMessage("Title must be at most 120 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").optional().trim().isLength({ max: 50 }).withMessage("Category must be at most 50 characters"),
];

exports.updateCourseRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 120 }).withMessage("Title must be at most 120 characters"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("category").optional().trim().isLength({ max: 50 }).withMessage("Category must be at most 50 characters"),
];

exports.listCoursesRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50"),
];

exports.rateCourseRules = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be a whole number between 1 and 5"),
  body("review").optional().isLength({ max: 500 }).withMessage("Review must be at most 500 characters"),
];