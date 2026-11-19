import { api } from "./api";

function assertApiSuccess(payload) {
  if (payload?.error) throw new Error(payload.error);
  return payload;
}

export function normalizeMonitor(value) {
  if (!value || typeof value !== "object" || !(value.id || value.monitor_id || value.name || value.monitor_name)) return null;
  const currentStatus = value.status === true || value.status === "up" || value.status === "operational"
    ? true
    : value.status === false || value.status === "down" || value.status === "unavailable"
      ? false
      : null;
  const statusHistory = Array.isArray(value.status_history) ? value.status_history.map((entry, index) => ({
    id: `${entry?.timestamp ?? "unknown"}-${index}`,
    status: entry?.status === true || entry?.status === "up" || entry?.status === "operational",
    timestamp: Number(entry?.timestamp),
  })).filter((entry) => Number.isFinite(entry.timestamp)).sort((a, b) => b.timestamp - a.timestamp) : [];
  return {
    ...value,
    monitor_id: value.monitor_id || value.id,
    monitor_name: value.monitor_name || value.name || "Untitled monitor",
    monitor_description: value.monitor_description ?? value.description ?? "",
    monitor_tag: value.monitor_tag || value.tag || "",
    monitor_url: value.monitor_url || value.url || "",
    monitor_status: currentStatus,
    monitor_status_history: statusHistory,
  };
}

export function normalizeMonitors(payload) {
  assertApiSuccess(payload);
  if (Array.isArray(payload)) return payload.map(normalizeMonitor).filter(Boolean);
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["monitors", "items", "results", "data"]) {
    if (Array.isArray(payload[key])) return payload[key].map(normalizeMonitor).filter(Boolean);
    if (payload[key] && typeof payload[key] === "object") return normalizeMonitors(payload[key]);
  }
  const single = normalizeMonitor(payload);
  if (single) return [single];
  return Object.entries(payload).map(([monitorId, monitor]) => {
    if (!monitor || typeof monitor !== "object") return null;
    return normalizeMonitor(monitor.id || monitor.monitor_id ? monitor : { ...monitor, id: monitorId });
  }).filter(Boolean);
}

function monitorEndpoint(projectId, environmentId, monitorId) {
  const base = `/api/v1/projects/${encodeURIComponent(projectId)}/environments/${encodeURIComponent(environmentId)}/monitors`;
  return monitorId ? `${base}/${encodeURIComponent(monitorId)}` : base;
}

export async function listMonitors(projectId, environmentId) {
  return normalizeMonitors(await api(monitorEndpoint(projectId, environmentId)));
}

export async function getMonitor(projectId, environmentId, monitorId) {
  return normalizeMonitor(assertApiSuccess(await api(monitorEndpoint(projectId, environmentId, monitorId))));
}

export async function createMonitor(projectId, environmentId, values) {
  return normalizeMonitor(assertApiSuccess(await api(monitorEndpoint(projectId, environmentId), { method: "POST", body: JSON.stringify(values) })));
}

export async function updateMonitor(projectId, environmentId, monitorId, values) {
  return normalizeMonitor(assertApiSuccess(await api(monitorEndpoint(projectId, environmentId, monitorId), { method: "PUT", body: JSON.stringify(values) })));
}

export async function deleteMonitor(projectId, environmentId, monitorId) {
  return assertApiSuccess(await api(monitorEndpoint(projectId, environmentId, monitorId), { method: "DELETE" }));
}
