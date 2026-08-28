import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import db from "./db.js";
import { validateTask } from "./validation.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "TaskForge API" });
});

app.get("/api/tasks", (req, res) => {
  const { status, priority, q } = req.query;
  let sql = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  if (priority) {
    sql += " AND priority = ?";
    params.push(priority);
  }

  if (q) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += `
    ORDER BY
      CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END,
      COALESCE(due_date, '9999-12-31'),
      created_at DESC
  `;

  res.json(db.prepare(sql).all(...params));
});

app.get("/api/stats", (_req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;
  const done = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status='Done'").get().count;
  const inProgress = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE status='In Progress'").get().count;
  const highPriority = db.prepare("SELECT COUNT(*) AS count FROM tasks WHERE priority='High' AND status!='Done'").get().count;

  res.json({ total, done, inProgress, highPriority });
});

app.post("/api/tasks", (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const {
    title,
    description = "",
    priority = "Medium",
    status = "To Do",
    due_date = null
  } = req.body;

  const info = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(title.trim(), description.trim(), priority, status, due_date || null);

  res.status(201).json(
    db.prepare("SELECT * FROM tasks WHERE id=?").get(info.lastInsertRowid)
  );
});

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM tasks WHERE id=?").get(id);
  if (!existing) return res.status(404).json({ message: "Task not found." });

  const errors = validateTask(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const updated = { ...existing, ...req.body };

  db.prepare(`
    UPDATE tasks
    SET title=?, description=?, priority=?, status=?, due_date=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    updated.title.trim(),
    String(updated.description || "").trim(),
    updated.priority,
    updated.status,
    updated.due_date || null,
    id
  );

  res.json(db.prepare("SELECT * FROM tasks WHERE id=?").get(id));
});

app.delete("/api/tasks/:id", (req, res) => {
  const info = db.prepare("DELETE FROM tasks WHERE id=?").run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ message: "Task not found." });
  res.status(204).end();
});

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => console.log(`TaskForge API running on port ${PORT}`));
