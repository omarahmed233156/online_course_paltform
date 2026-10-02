const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Comment = require("../models/Comment");
const Enrollment = require("../models/Enrollment");
const { canAccessCourse } = require("../utils/access");

// GET /api/lessons/:lessonId/comments
exports.getComments = async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  const course = await Course.findById(lesson.course);
  if (!(await canAccessCourse(req.user, course))) {
    return res.status(403).json({ message: "You do not have access to this lesson" });
  }
  const comments = await Comment.find({ lesson: lesson._id })
    .populate("user", "name role")
    .sort("createdAt");
  res.json(comments);
};

// POST /api/lessons/:lessonId/comments  (enrolled students only)
exports.addComment = async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  const enrolled = await Enrollment.exists({ student: req.user._id, course: lesson.course });
  if (!enrolled) {
    return res.status(403).json({ message: "Enroll in this course to comment" });
  }
  const comment = await Comment.create({ text: req.body.text, user: req.user._id, lesson: lesson._id });
  await comment.populate("user", "name role");
  res.status(201).json(comment);
};

// DELETE /api/comments/:id  (comment author only)
exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (!comment.user.equals(req.user._id)) {
    return res.status(403).json({ message: "You can only delete your own comments" });
  }
  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};