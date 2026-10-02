import { useEffect, useState } from "react";
import api, { getError } from "../api";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/courses/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .get("/courses", { params: { search, category, page, limit: 9 } })
        .then((res) => {
          setCourses(res.data.data);
          setTotalPages(res.data.totalPages);
          setError("");
        })
        .catch((err) => setError(getError(err)));
    }, 300); // small debounce for the search box
    return () => clearTimeout(timer);
  }, [search, category, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h2>All Courses</h2>
      <div className="filters">
        <input placeholder="Search courses..." value={search} onChange={handleSearch} />
        <select value={category} onChange={handleCategory}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {courses.length === 0 && <p className="muted">No courses found.</p>}

      <div className="grid">
        {courses.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}