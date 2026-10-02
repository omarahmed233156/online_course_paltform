import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getError } from "../api";

const emptyLesson = { title: "", content: "", videoUrl: "" };

export default function ManageCourse() {
  const { id } = useParams(); // undefined when creating a new course
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLessons = async () => {
    const res = await api.get(`/courses/${id}/lessons`);
    setLessons(res.data);
  };

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/courses/${id}`)
      .then((res) => {
        const { title, description, category } = res.data;
        setForm({ title, description, category });
        return loadLessons();
      })
      .catch((err) => setError(getError(err)));
  }, [id]);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (isNew) {
        const res = await api.post("/courses", form);
        navigate(`/instructor/courses/${res.data._id}`);
      } else {
        await api.put(`/courses/${id}`, form);
        setMessage("Course updated");
      }
    } catch (err) {
      setError(getError(err));
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/courses/${id}/lessons`, lessonForm);
      setLessonForm(emptyLesson);
      loadLessons();
    } catch (err) {
      setError(getError(err));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      loadLessons();
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <div>
      <h2>{isNew ? "Create Course" : "Manage Course"}</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form className="form" onSubmit={handleCourseSubmit}>
        <input placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Category (e.g. Programming)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <textarea rows="4" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit">{isNew ? "Create Course" : "Save Changes"}</button>
      </form>

      {!isNew && (
        <>
          <h3>Lessons</h3>
          {lessons.length === 0 && <p className="muted">No lessons yet.</p>}
          {lessons.map((l) => (
            <div className="row lesson-row" key={l._id}>
              <span>
                {l.order}. {l.title}
              </span>
              <button className="danger" onClick={() => handleDeleteLesson(l._id)}>
                Delete
              </button>
            </div>
          ))}

          <form className="form" onSubmit={handleAddLesson}>
            <h4>Add a lesson</h4>
            <input placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            <input placeholder="Video URL (optional)" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
            <textarea rows="4" placeholder="Lesson content" value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
            <button type="submit">Add Lesson</button>
          </form>
        </>
      )}
    </div>
  );
}