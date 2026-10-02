const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Returns the course if the instructor owns it, otherwise sends an error and returns null
exports.getOwnedCourse = async (courseId, user, res) => {
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404).json({ message: "Course not found" });
    return null;
  }
  if (!course.instructor.equals(user._id)) {
    res.status(403).json({ message: "You are not the owner of this course" });
    return null;
  }
  return course;
};

// Owner instructor or enrolled student
exports.canAccessCourse = async (user, course) => {
  if (user.role === "instructor") return course.instructor.equals(user._id);
  return !!(await Enrollment.exists({ student: user._id, course: course._id }));
};