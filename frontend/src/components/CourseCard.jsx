import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="card">
      <span className="badge">{course.category}</span>
      <h3>{course.title}</h3>
      <p className="muted">{course.description.slice(0, 100)}...</p>
      <p>
        By {course.instructor?.name || "Unknown"} · ⭐ {course.ratingsAverage || 0} (
        {course.ratingsCount})
      </p>
      <Link to={`/courses/${course._id}`}>
        <button>View Course</button>
      </Link>
    </div>
  );
}