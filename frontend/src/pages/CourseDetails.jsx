import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => setError(getError(err)));

    if (user?.role === "student") {
      api
        .get("/enrollments/my")
        .then((res) => setEnrolled(res.data.some((e) => e.course._id === id)))
        .catch(() => {});
    }
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post(`/courses/${id}/enroll`);
      navigate(`/courses/${id}/learn`);
    } catch (err) {
      setError(getError(err));
    }
  };

  if (error && !course) return <p className="error">{error}</p>;
  if (!course) return <p>Loading...</p>;

  const isOwner = user?.role === "instructor" && course.instructor?._id === user.id;

  return (
    <div className="details">
      <span className="badge">{course.category}</span>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p className="muted">
        Instructor: {course.instructor?.name} · {course.lessonsCount} lessons ·{" "}
        {course.enrollmentsCount} students
      </p>
      <p>
        ⭐ {course.ratingsAverage || 0} ({course.ratingsCount} ratings)
      </p>

      {error && <p className="error">{error}</p>}

      {isOwner && (
        <Link to={`/instructor/courses/${course._id}`}>
          <button>Manage Course</button>
        </Link>
      )}
      {!isOwner && enrolled && (
        <Link to={`/courses/${course._id}/learn`}>
          <button>Continue Learning</button>
        </Link>
      )}
      {!isOwner && !enrolled && user?.role !== "instructor" && (
        <button onClick={handleEnroll}>Enroll Now</button>
      )}
    </div>
  );
}