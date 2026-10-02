import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getError } from "../api";

export default function MyLearning() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/enrollments/my")
      .then((res) => setItems(res.data))
      .catch((err) => setError(getError(err)));
  }, []);

  return (
    <div>
      <h2>My Learning</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && (
        <p className="muted">
          You have not enrolled in any course yet. <Link to="/">Browse courses</Link>
        </p>
      )}

      <div className="grid">
        {items.map(({ _id, course, progress }) => (
          <div className="card" key={_id}>
            <span className="badge">{course.category}</span>
            <h3>{course.title}</h3>
            <p className="muted">By {course.instructor?.name}</p>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
            </div>
            <p>
              {progress.completed}/{progress.total} lessons · {progress.percent}%
            </p>
            <Link to={`/courses/${course._id}/learn`}>
              <button>Continue</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}