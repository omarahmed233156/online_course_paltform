const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const { buildProgress } = require("../utils/progress");

// POST /api/courses/:courseId/enroll
exports.enroll = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (await Enrollment.exists({ student: req.user._id, course: course._id })) {
    return res.status(409).json({ message: "You are already enrolled in this course" });
  }
  const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
  res.status(201).json(enrollment);
};

// GET /api/enrollments/my
exports.myEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: "course", populate: { path: "instructor", select: "name" } })
    .sort("-createdAt");

  const result = await Promise.all(
    enrollments
      .filter((e) => e.course) // skip if the course was deleted
      .map(async (e) => ({
        _id: e._id,
        course: e.course,
        progress: await buildProgress(e),
      }))
  );
  res.json(result);
};

// GET /api/courses/:courseId/progress
exports.getProgress = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment) return res.status(404).json({ message: "You are not enrolled in this course" });
  res.json(await buildProgress(enrollment));
};

// POST /api/courses/:courseId/rate   body: { rating, review }
exports.rateCourse = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  if (!enrollment) {
    return res.status(403).json({ message: "Only enrolled students can rate this course" });
  }
  enrollment.rating = Number(req.body.rating);
  enrollment.review = req.body.review || "";
  await enrollment.save();

  // Recalculate the course average
  const stats = await Enrollment.aggregate([
    { $match: { course: enrollment.course, rating: { $exists: true, $ne: null } } },
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const course = await Course.findById(enrollment.course);
  course.ratingsAverage = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0;
  course.ratingsCount = stats.length ? stats[0].count : 0;
  await course.save();

  res.json({ ratingsAverage: course.ratingsAverage, ratingsCount: course.ratingsCount });
};