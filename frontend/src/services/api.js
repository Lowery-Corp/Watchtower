const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export async function api(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    /* empty response */
  }
  if (!response.ok) {
    const detail = Array.isArray(body?.detail) ? body.detail.map((error) => error.msg).join(" ") : body?.detail;
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return body;
}

export { apiUrl };
