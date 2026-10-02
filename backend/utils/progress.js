const Lesson = require("../models/Lesson");

exports.buildProgress = async (enrollment) => {
  const total = await Lesson.countDocuments({ course: enrollment.course });
  const completed = enrollment.completedLessons.length;
  return {
    completedLessons: enrollment.completedLessons,
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    rating: enrollment.rating || null,
    review: enrollment.review || "",
  };
};