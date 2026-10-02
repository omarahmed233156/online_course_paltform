const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const { myEnrollments } = require("../controllers/enrollmentController");

router.get("/my", protect, authorize("student"), myEnrollments);

module.exports = router;