import { useEffect, useState } from "react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Comments({ lessonId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/lessons/${lessonId}/comments`);
      setComments(res.data);
    } catch (err) {
      setError(getError(err));
    }
  };

  useEffect(() => {
    setError("");
    load();
  }, [lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post(`/lessons/${lessonId}/comments`, { text });
      setComments([...comments, res.data]);
      setText("");
    } catch (err) {
      setError(getError(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <div className="comments">
      <h4>Comments ({comments.length})</h4>
      {error && <p className="error">{error}</p>}

      {comments.map((c) => (
        <div key={c._id} className="comment">
          <strong>{c.user?.name}</strong>
          <span className="muted"> · {new Date(c.createdAt).toLocaleString()}</span>
          <p>{c.text}</p>
          {c.user?._id === user.id && (
            <button className="link-btn" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          )}
        </div>
      ))}

      {user.role === "student" && (
        <form onSubmit={handleSubmit}>
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
}