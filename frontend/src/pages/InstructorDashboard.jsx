import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/courses/mine")
      .then((res) => setCourses(res.data))
      .catch((err) => setError(getError(err)));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course and all its lessons?")) return;
    try {
      await api.delete(`/courses/${id}`);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <div>
      <div className="row">
        <h2>My Courses</h2>
        <Link to="/instructor/courses/new">
          <button>+ New Course</button>
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      {courses.length === 0 && <p className="muted">You have not created any courses yet.</p>}

      <div className="grid">
        {courses.map((c) => (
          <div className="card" key={c._id}>
            <span className="badge">{c.category}</span>
            <h3>{c.title}</h3>
            <p>
              ⭐ {c.ratingsAverage || 0} ({c.ratingsCount})
            </p>
            <Link to={`/instructor/courses/${c._id}`}>
              <button>Manage</button>
            </Link>{" "}
            <button className="danger" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}