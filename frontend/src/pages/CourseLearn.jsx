import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
import Comments from "../components/Comments";

export default function CourseLearn() {
  const { id } = useParams();
  const { user } = useAuth();
  const isStudent = user.role === "student";

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/courses/${id}/lessons`),
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setCurrent((prev) => prev || lessonsRes.data[0] || null);

      if (isStudent) {
        const progressRes = await api.get(`/courses/${id}/progress`);
        setProgress(progressRes.data);
        if (progressRes.data.rating) {
          setRating(progressRes.data.rating);
          setReview(progressRes.data.review);
        }
      }
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isCompleted = (lessonId) =>
    progress?.completedLessons.map(String).includes(String(lessonId));

  const toggleComplete = async () => {
    try {
      const res = await api.post(`/lessons/${current._id}/complete`);
      setProgress((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(getError(err));
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/courses/${id}/rate`, { rating, review });
      setMessage("Thanks for your rating!");
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);
    } catch (err) {
      setError(getError(err));
    }
  };

  if (error && !course) return <p className="error">{error}</p>;
  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <Link to={`/courses/${id}`}>← Back to course</Link>
      <h2>{course.title}</h2>

      {isStudent && progress && (
        <>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="muted">
            Progress: {progress.completed}/{progress.total} lessons ({progress.percent}%)
          </p>
        </>
      )}
      {error && <p className="error">{error}</p>}

      <div className="learn-layout">
        <aside className="sidebar">
          <h4>Lessons</h4>
          {lessons.length === 0 && <p className="muted">No lessons yet.</p>}
          {lessons.map((l) => (
            <div
              key={l._id}
              className={`lesson-item ${current?._id === l._id ? "active" : ""}`}
              onClick={() => setCurrent(l)}
            >
              {isStudent && (isCompleted(l._id) ? "✅ " : "⬜ ")}
              {l.order}. {l.title}
            </div>
          ))}
        </aside>

        <section className="lesson-content">
          {current ? (
            <>
              <h3>{current.title}</h3>
              {current.videoUrl && (
                <p>
                  Video:{" "}
                  <a href={current.videoUrl} target="_blank" rel="noreferrer">
                    {current.videoUrl}
                  </a>
                </p>
              )}
              <p style={{ whiteSpace: "pre-wrap" }}>{current.content}</p>

              {isStudent && (
                <button onClick={toggleComplete}>
                  {isCompleted(current._id) ? "Mark as not completed" : "Mark as completed"}
                </button>
              )}

              <Comments lessonId={current._id} />
            </>
          ) : (
            <p className="muted">Select a lesson to start.</p>
          )}
        </section>
      </div>

      {isStudent && (
        <form className="form" onSubmit={submitRating}>
          <h4>Rate this course</h4>
          {message && <p className="success">{message}</p>}
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {"⭐".repeat(n)}
              </option>
            ))}
          </select>
          <textarea
            rows="2"
            placeholder="Write a short review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button type="submit">Submit Rating</button>
        </form>
      )}
    </div>
  );
}