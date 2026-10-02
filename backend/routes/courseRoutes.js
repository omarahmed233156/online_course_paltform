const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const course = require("../controllers/courseController");
const lesson = require("../controllers/lessonController");
const enrollment = require("../controllers/enrollmentController");
const { createCourseRules, updateCourseRules, listCoursesRules, rateCourseRules } = require("../validators/courseValidators");
const { createLessonRules } = require("../validators/lessonValidators");

router.get("/", listCoursesRules, validate, course.listCourses);
router.get("/categories", course.listCategories);
router.get("/mine", protect, authorize("instructor"), course.myCourses);
router.post("/", protect, authorize("instructor"), createCourseRules, validate, course.createCourse);

router.get("/:id", course.getCourse);
router.put("/:id", protect, authorize("instructor"), updateCourseRules, validate, course.updateCourse);
router.delete("/:id", protect, authorize("instructor"), course.deleteCourse);

// Lessons of a course
router.get("/:courseId/lessons", protect, lesson.getLessons);
router.post("/:courseId/lessons", protect, authorize("instructor"), createLessonRules, validate, lesson.createLesson);

// Enrollment, progress, rating
router.post("/:courseId/enroll", protect, authorize("student"), enrollment.enroll);
router.get("/:courseId/progress", protect, authorize("student"), enrollment.getProgress);
router.post("/:courseId/rate", protect, authorize("student"), rateCourseRules, validate, enrollment.rateCourse);

module.exports = router;