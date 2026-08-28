
import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const blankForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  due_date: ""
};

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, inProgress: 0, highPriority: 0 });
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ q: "", status: "", priority: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setError("");
      setLoading(true);
      const [taskData, statData] = await Promise.all([
        api.getTasks(filters),
        api.getStats()
      ]);
      setTasks(taskData);
      setStats(statData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [filters.q, filters.status, filters.priority]);

  async function submit(e) {
    e.preventDefault();
    try {
      setError("");
      if (editingId) {
        await api.updateTask(editingId, form);
      } else {
        await api.createTask(form);
      }
      setForm(blankForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      due_date: task.due_date || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeTask(id) {
    if (!confirm("Delete this task?")) return;
    await api.deleteTask(id);
    await load();
  }

  const emptyMessage = useMemo(
    () => filters.q || filters.status || filters.priority
      ? "No tasks match the current filters."
      : "No tasks yet. Create your first task.",
    [filters]
  );

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Productivity Dashboard</p>
          <h1>TaskForge</h1>
          <p>Plan work, track progress, and finish what matters.</p>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Completed" value={stats.done} />
        <StatCard label="High Priority" value={stats.highPriority} />
      </section>

      <section className="panel">
        <h2>{editingId ? "Edit task" : "Create task"}</h2>
        <form className="task-form" onSubmit={submit}>
          <input
            required
            minLength="2"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="form-row">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>To Do</option><option>In Progress</option><option>Done</option>
            </select>
            <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <div className="actions">
            <button type="submit">{editingId ? "Save changes" : "Add task"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => {
                setEditingId(null);
                setForm(blankForm);
              }}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Tasks</h2>
          <div className="filters">
            <input
              placeholder="Search..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All statuses</option>
              <option>To Do</option><option>In Progress</option><option>Done</option>
            </select>
            <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="">All priorities</option>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {loading ? <p>Loading...</p> : tasks.length === 0 ? <p className="muted">{emptyMessage}</p> : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-top">
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description"}</p>
                  </div>
                  <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                <div className="task-meta">
                  <span>{task.status}</span>
                  <span>{task.due_date ? `Due ${task.due_date}` : "No deadline"}</span>
                </div>
                <div className="actions">
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button className="danger" onClick={() => removeTask(task.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
