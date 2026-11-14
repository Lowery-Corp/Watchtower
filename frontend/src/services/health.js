import { api } from "./api";

export const healthProbes = [
  ["health", "API health", "/api/v1/health"],
  ["ready", "Readiness", "/api/v1/health/ready"],
  ["live", "Liveness", "/api/v1/health/live"],
];

export async function checkHealth() {
  const results = await Promise.all(
    healthProbes.map(async ([key, label, path]) => {
      try {
        const data = await api(path);
        return [key, { label, ok: true, message: data?.message || "Service responded normally." }];
      } catch (error) {
        return [key, { label, ok: false, message: error.message }];
      }
    })
  );
  return Object.fromEntries(results);
}
