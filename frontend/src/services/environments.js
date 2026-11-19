import { api } from "./api";

function assertApiSuccess(payload) {
  if (payload?.error) throw new Error(payload.error);
  return payload;
}

export function normalizeEnvironment(value) {
  if (!value || typeof value !== "object" || !(value.id || value.environment_id || value.name || value.environment_name)) return null;
  return {
    ...value,
    environment_id: value.environment_id || value.id,
    environment_name: value.environment_name || value.name || "Untitled environment",
    environment_description: value.environment_description ?? value.description ?? "",
  };
}

export function normalizeEnvironments(payload) {
  assertApiSuccess(payload);
  if (Array.isArray(payload)) return payload.map(normalizeEnvironment).filter(Boolean);
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["environments", "items", "results", "data"]) {
    if (Array.isArray(payload[key])) return payload[key].map(normalizeEnvironment).filter(Boolean);
    if (payload[key] && typeof payload[key] === "object") return normalizeEnvironments(payload[key]);
  }
  const single = normalizeEnvironment(payload);
  if (single) return [single];
  return Object.entries(payload).map(([environmentId, environment]) => {
    if (!environment || typeof environment !== "object") return null;
    return normalizeEnvironment(environment.id || environment.environment_id ? environment : { ...environment, id: environmentId });
  }).filter(Boolean);
}

function environmentEndpoint(projectId, environmentId) {
  const base = `/api/v1/projects/${encodeURIComponent(projectId)}/environments`;
  return environmentId ? `${base}/${encodeURIComponent(environmentId)}` : base;
}

export async function listEnvironments(projectId) {
  return normalizeEnvironments(await api(environmentEndpoint(projectId)));
}

export async function getEnvironment(projectId, environmentId) {
  return normalizeEnvironment(assertApiSuccess(await api(environmentEndpoint(projectId, environmentId))));
}

export async function createEnvironment(projectId, values) {
  return normalizeEnvironment(assertApiSuccess(await api(environmentEndpoint(projectId), { method: "POST", body: JSON.stringify(values) })));
}

export async function updateEnvironment(projectId, environmentId, values) {
  return normalizeEnvironment(assertApiSuccess(await api(environmentEndpoint(projectId, environmentId), { method: "PUT", body: JSON.stringify(values) })));
}
