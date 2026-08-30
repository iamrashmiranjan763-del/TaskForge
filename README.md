# TaskForge

A full-stack task and productivity manager built with React, Node.js, Express, and SQLite.
## Live Demo

🚀 **Live Application:** https://spectacular-light-production-ee13.up.railway.app

TaskForge is deployed on Railway with separate frontend and backend services. The SQLite database uses persistent storage so task data is retained across deployments.

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

## Architecture

TaskForge follows a simple full-stack client-server architecture:

- **React + Vite** provides the user interface.
- **Express.js** exposes REST API endpoints for task operations.
- **SQLite** stores task information persistently.
- The frontend communicates with the backend using the Fetch API.
- **CORS, Helmet, and rate limiting** provide basic API security.
- The application is deployed on **Railway**, with persistent storage for the SQLite database.

`Frontend → REST API → Express Backend → SQLite Database`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Retrieve dashboard statistics |

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
| GET | /api/health | Check API health |
| GET | /api/tasks | Retrieve tasks |
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

