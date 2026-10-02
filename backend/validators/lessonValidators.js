const { body } = require("express-validator");

exports.createLessonRules = [
  body("title").trim().notEmpty().withMessage("Lesson title is required").isLength({ max: 120 }).withMessage("Lesson title must be at most 120 characters"),
  body("content").optional().isString().withMessage("Content must be text"),
  body("videoUrl").optional({ checkFalsy: true }).isURL().withMessage("Video URL must be a valid URL"),
  body("order").optional().isInt({ min: 1 }).withMessage("Order must be a positive integer"),
];

exports.updateLessonRules = [
  body("title").optional().trim().notEmpty().withMessage("Lesson title cannot be empty"),
  body("content").optional().isString().withMessage("Content must be text"),
  body("videoUrl").optional({ checkFalsy: true }).isURL().withMessage("Video URL must be a valid URL"),
  body("order").optional().isInt({ min: 1 }).withMessage("Order must be a positive integer"),
];