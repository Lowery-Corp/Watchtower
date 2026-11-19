import { useCallback, useEffect, useState } from "react";
import { createEnvironment, listEnvironments, updateEnvironment } from "../services/environments";

export function useEnvironments(projectId) {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try { setEnvironments(await listEnvironments(projectId)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (values) => {
    setSaving(true); setError("");
    try {
      const environment = await createEnvironment(projectId, values);
      if (environment) setEnvironments((current) => [...current, environment]);
      else await refresh();
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const update = async (environmentId, values) => {
    setSaving(true); setError("");
    try {
      const environment = await updateEnvironment(projectId, environmentId, values);
      if (environment) setEnvironments((current) => current.map((item) => item.environment_id === environmentId ? environment : item));
      else await refresh();
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  return { environments, loading, saving, error, refresh, create, update };
}
