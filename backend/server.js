require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Course Platform API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});