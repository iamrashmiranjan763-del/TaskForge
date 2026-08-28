export const VALID_PRIORITIES = ["Low", "Medium", "High"];
export const VALID_STATUSES = ["To Do", "In Progress", "Done"];

export function validateTask(payload, partial = false) {
  const errors = [];

  if (!partial || Object.hasOwn(payload, "title")) {
    if (typeof payload.title !== "string" || payload.title.trim().length < 2) {
      errors.push("Title must contain at least 2 characters.");
    }
  }

  if (Object.hasOwn(payload, "priority") && !VALID_PRIORITIES.includes(payload.priority)) {
    errors.push("Invalid priority.");
  }

  if (Object.hasOwn(payload, "status") && !VALID_STATUSES.includes(payload.status)) {
    errors.push("Invalid status.");
  }

  if (Object.hasOwn(payload, "description") && typeof payload.description !== "string") {
    errors.push("Description must be text.");
  }

  return errors;
}
