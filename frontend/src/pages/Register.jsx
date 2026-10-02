import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getError } from "../api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(user.role === "instructor" ? "/instructor" : "/my-learning");
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} minLength={6} required />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="student">I am a Student</option>
        <option value="instructor">I am an Instructor</option>
      </select>
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}