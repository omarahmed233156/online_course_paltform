const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const Comment = require("../models/Comment");
const { getOwnedCourse } = require("../utils/access");

// GET /api/courses?search=js&category=Programming&page=1&limit=9
exports.listCourses = async (req, res) => {
  const { search, category } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;

  const filter = {};
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate("instructor", "name")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Course.countDocuments(filter),
  ]);

  res.json({
    data: courses,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};

exports.listCategories = async (req, res) => {
  res.json(await Course.distinct("category"));
};

exports.myCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort("-createdAt");
  res.json(courses);
};

exports.getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor", "name");
  if (!course) return res.status(404).json({ message: "Course not found" });
  const lessonsCount = await Lesson.countDocuments({ course: course._id });
  const enrollmentsCount = await Enrollment.countDocuments({ course: course._id });
  res.json({ ...course.toObject(), lessonsCount, enrollmentsCount });
};

exports.createCourse = async (req, res) => {
  const { title, description, category } = req.body;
  const course = await Course.create({
    title,
    description,
    category: category || "General",
    instructor: req.user._id,
  });
  res.status(201).json(course);
};

exports.updateCourse = async (req, res) => {
  const course = await getOwnedCourse(req.params.id, req.user, res);
  if (!course) return;
  const { title, description, category } = req.body;
  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;
  if (category !== undefined) course.category = category;
  await course.save();
  res.json(course);
};

exports.deleteCourse = async (req, res) => {
  const course = await getOwnedCourse(req.params.id, req.user, res);
  if (!course) return;
  const lessons = await Lesson.find({ course: course._id }).select("_id");
  const lessonIds = lessons.map((l) => l._id);
  await Comment.deleteMany({ lesson: { $in: lessonIds } });
  await Lesson.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: "Course deleted" });
};