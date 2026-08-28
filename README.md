# TaskForge

A full-stack task and productivity manager built with React, Node.js, Express, and SQLite.

## Features
- Create, edit, and delete tasks
- Priority levels: Low, Medium, High
- Status workflow: To Do, In Progress, Done
- Due dates
- Search and filter by status/priority
- Dashboard summary cards
- Persistent SQLite database
- REST API
- Basic security middleware and rate limiting
- Responsive UI

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite via better-sqlite3
- Security: Helmet, CORS, express-rate-limit

## Project Structure
```text
TaskForge/
  client/
  server/
```

## Run Locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend
Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/stats | Dashboard statistics |

## Resume Description
**TaskForge — Full-Stack Task & Productivity Manager**  
React, Node.js, Express, SQLite

- Built a full-stack productivity application with task CRUD operations, priorities, deadlines, workflow status, search, and filtering.
- Designed RESTful APIs using Express and implemented persistent data storage with SQLite.
- Added dashboard statistics, responsive UI, request validation, security headers, and API rate limiting.

## Next Improvements
- Authentication
- Multi-user workspaces
- Kanban drag-and-drop
- Automated tests
- PostgreSQL migration
- Deployment
