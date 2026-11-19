import { useCallback, useEffect, useState } from "react";
import { getMonitor } from "../services/monitors";
import { buildUptimePivot, getUptimePivot } from "../services/uptime";

const emptyPivot = {
  projects: [],
  summary: { projectCount: 0, environmentCount: 0, monitorCount: 0, sampleCount: 0, uptime: null, status: null },
};

export function useUptimePivot() {
  const [pivot, setPivot] = useState(emptyPivot);
  const [loading, setLoading] = useState(true);
  const [refreshingMonitors, setRefreshingMonitors] = useState(new Set());
  const [error, setError] = useState("");

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      setPivot(await getUptimePivot());
    } catch (err) {
      setError(err.message || "The uptime overview could not be loaded.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(false), 15000);
    return () => clearInterval(timer);
  }, [load]);

  const refreshMonitor = async (projectId, environmentId, monitorId) => {
    setRefreshingMonitors((current) => new Set(current).add(monitorId));
    setError("");
    try {
      const monitor = await getMonitor(projectId, environmentId, monitorId);
      if (!monitor) throw new Error("The monitor response was empty.");
      setPivot((current) => buildUptimePivot(current.projects.map((project) => project.project_id !== projectId ? project : {
        ...project,
        environments: project.environments.map((environment) => environment.environment_id !== environmentId ? environment : {
          ...environment,
          monitors: environment.monitors.map((item) => item.monitor_id === monitorId ? monitor : item),
        }),
      })));
    } catch (err) {
      setError(err.message || "The monitor could not be refreshed.");
    } finally {
      setRefreshingMonitors((current) => {
        const next = new Set(current);
        next.delete(monitorId);
        return next;
      });
    }
  };

  return { ...pivot, loading, error, refreshingMonitors, refresh: () => load(true), refreshMonitor };
}
