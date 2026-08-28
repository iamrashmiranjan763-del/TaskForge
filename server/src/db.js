import Database from "better-sqlite3";

const db = new Database("taskforge.db");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT NOT NULL DEFAULT 'Medium'
      CHECK(priority IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL DEFAULT 'To Do'
      CHECK(status IN ('To Do', 'In Progress', 'Done')),
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    insert.run(
      "Prepare resume",
      "Improve project descriptions and skills section.",
      "High",
      "In Progress",
      null
    );
    insert.run(
      "Practice DSA",
      "Solve arrays and strings problems.",
      "Medium",
      "To Do",
      null
    );
    insert.run(
      "Create GitHub profile",
      "Upload completed projects with strong README files.",
      "High",
      "Done",
      null
    );
  });

  seed();
}

export default db;
