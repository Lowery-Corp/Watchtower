import { useState } from "react";
import EnvironmentsTable from "../components/environments/EnvironmentsTable";
import EnvironmentDetails from "../components/environments/EnvironmentDetails";
import EnvironmentForm from "../components/environments/EnvironmentForm";
import { useEnvironments } from "../hooks/useEnvironments";

export default function ProjectEnvironmentsPage({ project, environmentId, onBack, onOpenEnvironment, onEnvironmentBack, onProjectChanged }) {
  const { environments, loading, saving, error, refresh, create, update } = useEnvironments(project.project_id);
  const [editing, setEditing] = useState(undefined);

  const submit = async (values) => {
    const success = editing ? await update(editing.environment_id, values) : await create(values);
    if (success) {
      setEditing(undefined);
      await onProjectChanged?.();
    }
  };

  if (environmentId) {
    const environment = environments.find((item) => item.environment_id === environmentId);
    if (loading && !environment) return <div className="content"><section className="projects-loading" aria-live="polite">Loading environment…</section></div>;
    if (!environment) return <div className="content resource-not-found"><button className="back-button" onClick={onEnvironmentBack}>Back to environments</button><p className="eyebrow">ENVIRONMENT NOT FOUND</p><h1>This environment isn’t available.</h1><p className="muted">The resource may have been removed or the URL may be incorrect.</p></div>;
    return <div className="content environments-page"><button className="back-button" onClick={onEnvironmentBack}>Back to environments</button><EnvironmentDetails environment={environment} onEdit={setEditing} />{editing !== undefined && <EnvironmentForm environment={editing} saving={saving} error={error} onCancel={() => setEditing(undefined)} onSubmit={submit} />}</div>;
  }

  return <div className="content environments-page">
    <button className="back-button" onClick={onBack}>Back to projects</button>
    <div className="heading environments-heading"><div><p className="eyebrow">PROJECT ENVIRONMENTS</p><h1>{project.project_name}</h1><p className="muted">Manage the deployment contexts attached to this project.</p></div><button className="primary new-project-button" onClick={() => setEditing(null)}>＋ New environment</button></div>
    {error && editing === undefined && <div className="projects-error" role="alert"><div><strong>We couldn’t load the environments.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div>}
    <div className="environment-summary"><div><strong>{environments.length}</strong><span>{environments.length === 1 ? " environment" : " environments"}</span></div><div className="project-context"><span>Project</span><code>{project.project_id}</code></div><button className="refresh" onClick={refresh} disabled={loading}>↻ {loading ? "Loading…" : "Refresh"}</button></div>
    {loading && environments.length === 0 ? <section className="projects-loading" aria-live="polite">Loading environments…</section> : environments.length === 0 && !error ? <section className="projects-empty"><span className="empty-symbol environment-empty-symbol" aria-hidden="true">◎</span><h2>No environments yet</h2><p>Add a development, staging, or production environment to this project.</p><button className="primary" onClick={() => setEditing(null)}>Create your first environment</button></section> : <EnvironmentsTable projectId={project.project_id} environments={environments} busy={saving} onOpen={onOpenEnvironment} onEdit={setEditing} />}
    {editing !== undefined && <EnvironmentForm environment={editing} saving={saving} error={error} onCancel={() => setEditing(undefined)} onSubmit={submit} />}
  </div>;
}
