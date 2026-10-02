# Course Platform

An online learning platform where instructors create courses and students enroll in them.
The project has a REST API (Node.js, Express, MongoDB) and a React frontend (JavaScript only).

## Features

- JWT authentication with two roles: **instructor** and **student**
- Instructors create, update and delete their own courses and lessons
- Students enroll in courses (once per course) and view lessons
- Students comment on lessons (enrolled students only)
- Course ratings and reviews
- Lesson progress tracking (mark lessons as completed, progress percentage)
- Course search, category filter and pagination
- Input validation with express-validator
- Centralized error handling

## Tech Stack

- Backend: Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs, express-validator
- Frontend: React (JavaScript), Vite, React Router, Axios

## Project Structure

```
backend/
  config/        database connection
  controllers/   request handlers
  middleware/    auth, validation, error handling
  models/        Mongoose models
  routes/        Express routers
  utils/         shared helpers
  validators/    express-validator rules
frontend/
  src/
    components/  reusable UI components
    context/     authentication context
    pages/       app pages
postman/         Postman collection
```

## Models

User, Course, Lesson, Enrollment, Comment

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit the values in .env
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment Variables

### backend/.env

| Variable | Description |
|---|---|
| PORT | Server port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign JWT tokens |

### frontend/.env

| Variable | Description |
|---|---|
| VITE_API_URL | Base URL of the API |

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/courses?search=&category=&page=&limit= | Public |
| GET | /api/courses/categories | Public |
| GET | /api/courses/mine | Instructor |
| GET | /api/courses/:id | Public |
| POST | /api/courses | Instructor |
| PUT | /api/courses/:id | Instructor (owner) |
| DELETE | /api/courses/:id | Instructor (owner) |
| GET | /api/courses/:courseId/lessons | Owner or enrolled student |
| POST | /api/courses/:courseId/lessons | Instructor (owner) |
| PUT | /api/lessons/:id | Instructor (owner) |
| DELETE | /api/lessons/:id | Instructor (owner) |
| POST | /api/courses/:courseId/enroll | Student |
| GET | /api/enrollments/my | Student |
| GET | /api/courses/:courseId/progress | Student |
| POST | /api/lessons/:id/complete | Student (toggle) |
| POST | /api/courses/:courseId/rate | Enrolled student |
| GET | /api/lessons/:lessonId/comments | Owner or enrolled student |
| POST | /api/lessons/:lessonId/comments | Enrolled student |
| DELETE | /api/comments/:id | Comment author |

Protected endpoints need the header `Authorization: Bearer <token>`.

### Pagination response

`GET /api/courses` returns:

```json
{ "data": [], "page": 1, "limit": 9, "total": 0, "totalPages": 0 }
```

### Error response

All errors use the same shape:

```json
{ "message": "Description of the error" }
```

Validation errors also include an `errors` array with `field` and `message`.

## Testing with Postman

1. Start the backend.
2. Import `courseproject.postman_collection.json` into Postman.
3. Right click the collection, choose **Run collection**, then **Run**.

The collection covers every endpoint, including negative cases (401, 403, 409, 400).
Tokens and IDs are stored automatically in collection variables.

## Roles and Permissions

- **Instructor**: manages only the courses and lessons they own.
- **Student**: enrolls, tracks progress, comments and rates courses they are enrolled in.