const { body } = require("express-validator");

exports.commentRules = [
  body("text").trim().notEmpty().withMessage("Comment text is required").isLength({ max: 1000 }).withMessage("Comment must be at most 1000 characters"),
];