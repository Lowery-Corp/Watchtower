import { useCallback, useEffect, useState } from "react";
import { createMonitor, deleteMonitor, listMonitors, updateMonitor } from "../services/monitors";

export function useMonitors(projectId, environmentId) {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (showLoading = true) => {
    if (!projectId || !environmentId) return;
    if (showLoading) setLoading(true);
    setError("");
    try { setMonitors(await listMonitors(projectId, environmentId)); }
    catch (err) { setError(err.message); }
    finally { if (showLoading) setLoading(false); }
  }, [projectId, environmentId]);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    load(true);
    const timer = setInterval(() => load(false), 15000);
    return () => clearInterval(timer);
  }, [load]);

  const create = async (values) => {
    setSaving(true); setError("");
    try {
      const monitor = await createMonitor(projectId, environmentId, values);
      if (monitor) setMonitors((current) => [...current, monitor]); else await refresh();
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const update = async (monitorId, values) => {
    setSaving(true); setError("");
    try {
      const monitor = await updateMonitor(projectId, environmentId, monitorId, values);
      if (monitor) setMonitors((current) => current.map((item) => item.monitor_id === monitorId ? monitor : item)); else await refresh();
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const remove = async (monitorId) => {
    setSaving(true); setError("");
    try { await deleteMonitor(projectId, environmentId, monitorId); setMonitors((current) => current.filter((item) => item.monitor_id !== monitorId)); return true; }
    catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  return { monitors, loading, saving, error, refresh, create, update, remove };
}
