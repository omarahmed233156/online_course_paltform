const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const lesson = require("../controllers/lessonController");
const comment = require("../controllers/commentController");
const { updateLessonRules } = require("../validators/lessonValidators");
const { commentRules } = require("../validators/commentValidators");

router.put("/:id", protect, authorize("instructor"), updateLessonRules, validate, lesson.updateLesson);
router.delete("/:id", protect, authorize("instructor"), lesson.deleteLesson);
router.post("/:id/complete", protect, authorize("student"), lesson.toggleComplete);

router.get("/:lessonId/comments", protect, comment.getComments);
router.post("/:lessonId/comments", protect, authorize("student"), commentRules, validate, comment.addComment);

module.exports = router;