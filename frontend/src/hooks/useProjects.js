import { useCallback, useEffect, useState } from "react";
import { createProject, deleteProject, listProjects, updateProject } from "../services/projects";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try { setProjects(await listProjects()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (values) => {
    setSaving(true); setError("");
    try {
      const project = await createProject(values);
      if (project) setProjects((current) => [...current, project]);
      else await refresh();
      return true;
    }
    catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const update = async (projectId, values) => {
    setSaving(true); setError("");
    try {
      const project = await updateProject(projectId, values);
      if (project) setProjects((current) => current.map((item) => item.project_id === projectId ? project : item));
      else await refresh();
      return true;
    }
    catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  const remove = async (projectId) => {
    setSaving(true); setError("");
    try { await deleteProject(projectId); setProjects((current) => current.filter((project) => project.project_id !== projectId)); return true; }
    catch (err) { setError(err.message); return false; }
    finally { setSaving(false); }
  };

  return { projects, loading, saving, error, refresh, create, update, remove };
}
