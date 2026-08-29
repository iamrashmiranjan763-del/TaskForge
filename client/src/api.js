const API_BASE = "https://taskforge-production-e933.up.railway.app/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.errors?.join(" ") || "Request failed.");
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  getTasks: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return request(`/tasks${qs ? `?${qs}` : ""}`);
  },
  getStats: () => request("/stats"),
  createTask: (task) => request("/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  }),
  updateTask: (id, task) => request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task)
  }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" })
};
