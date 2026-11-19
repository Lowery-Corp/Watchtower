import { api } from "./api";

const endpoint = "/api/v1/projects";

function looksLikeProject(value) {
  return value && typeof value === "object" && (value.project_id || value.id || value.project_name);
}

function assertApiSuccess(payload) {
  if (payload?.error) throw new Error(payload.error);
  return payload;
}

function normalizeProjectMap(projects) {
  if (!projects || typeof projects !== "object" || Array.isArray(projects)) return [];
  return Object.entries(projects).map(([projectId, project]) => {
    if (!project || typeof project !== "object") return null;
    return normalizeProject(project.id || project.project_id ? project : { ...project, id: projectId });
  }).filter(Boolean);
}

export function normalizeProject(value) {
  if (value?.project && typeof value.project === "object") return normalizeProject(value.project);
  if (!looksLikeProject(value)) return null;
  return {
    ...value,
    project_id: value.project_id || value.id,
    project_name: value.project_name || value.name || "Untitled project",
    project_description: value.project_description ?? value.description ?? "",
  };
}

export function normalizeProjects(payload) {
  if (Array.isArray(payload)) return payload.map(normalizeProject).filter(Boolean);
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["projects", "items", "results", "data"]) {
    if (Array.isArray(payload[key])) return payload[key].map(normalizeProject).filter(Boolean);
    if (payload[key] && typeof payload[key] === "object") {
      const nestedProject = normalizeProject(payload[key]);
      return nestedProject ? [nestedProject] : normalizeProjectMap(payload[key]);
    }
  }
  if (looksLikeProject(payload)) return [normalizeProject(payload)];
  return normalizeProjectMap(payload);
}

export async function listProjects({ cache } = {}) {
  const query = typeof cache === "boolean" ? `?cache=${cache}` : "";
  return normalizeProjects(await api(`${endpoint}${query}`));
}

export async function getProject(projectId) {
  return normalizeProject(assertApiSuccess(await api(`${endpoint}/${encodeURIComponent(projectId)}`)));
}

export async function createProject(project) {
  return normalizeProject(assertApiSuccess(await api(endpoint, { method: "POST", body: JSON.stringify(project) })));
}

export async function updateProject(projectId, updates) {
  return normalizeProject(assertApiSuccess(await api(`${endpoint}/${encodeURIComponent(projectId)}`, { method: "PUT", body: JSON.stringify(updates) })));
}

export async function deleteProject(projectId) {
  return assertApiSuccess(await api(`${endpoint}/${encodeURIComponent(projectId)}`, { method: "DELETE" }));
}
