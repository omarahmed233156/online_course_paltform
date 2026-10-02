import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyLearning from "./pages/MyLearning";
import CourseLearn from "./pages/CourseLearn";
import InstructorDashboard from "./pages/InstructorDashboard";
import ManageCourse from "./pages/ManageCourse";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/courses/:id/learn"
            element={
              <ProtectedRoute>
                <CourseLearn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute roles={["student"]}>
                <MyLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/new"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <ManageCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:id"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <ManageCourse />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}