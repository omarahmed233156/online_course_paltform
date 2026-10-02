const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const Comment = require("../models/Comment");
const { getOwnedCourse, canAccessCourse } = require("../utils/access");
const { buildProgress } = require("../utils/progress");

// GET /api/courses/:courseId/lessons  (owner instructor or enrolled student)
exports.getLessons = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (!(await canAccessCourse(req.user, course))) {
    return res.status(403).json({ message: "Enroll in this course to view its lessons" });
  }
  const lessons = await Lesson.find({ course: course._id }).sort("order createdAt");
  res.json(lessons);
};

// POST /api/courses/:courseId/lessons
exports.createLesson = async (req, res) => {
  const course = await getOwnedCourse(req.params.courseId, req.user, res);
  if (!course) return;
  const { title, content, videoUrl, order } = req.body;
  const count = await Lesson.countDocuments({ course: course._id });
  const lesson = await Lesson.create({
    title,
    content,
    videoUrl,
    order: order || count + 1,
    course: course._id,
  });
  res.status(201).json(lesson);
};

// PUT /api/lessons/:id
exports.updateLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  const course = await getOwnedCourse(lesson.course, req.user, res);
  if (!course) return;
  ["title", "content", "videoUrl", "order"].forEach((f) => {
    if (req.body[f] !== undefined) lesson[f] = req.body[f];
  });
  await lesson.save();
  res.json(lesson);
};

// DELETE /api/lessons/:id
exports.deleteLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  const course = await getOwnedCourse(lesson.course, req.user, res);
  if (!course) return;
  await Comment.deleteMany({ lesson: lesson._id });
  await Enrollment.updateMany({ course: course._id }, { $pull: { completedLessons: lesson._id } });
  await lesson.deleteOne();
  res.json({ message: "Lesson deleted" });
};

// POST /api/lessons/:id/complete  -> toggles completion for the student
exports.toggleComplete = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: lesson.course });
  if (!enrollment) return res.status(403).json({ message: "You are not enrolled in this course" });

  const index = enrollment.completedLessons.findIndex((id) => id.equals(lesson._id));
  if (index >= 0) enrollment.completedLessons.splice(index, 1);
  else enrollment.completedLessons.push(lesson._id);
  await enrollment.save();

  res.json(await buildProgress(enrollment));
};