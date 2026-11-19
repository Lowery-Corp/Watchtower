import { useState } from "react";
import ProjectsTable from "../components/projects/ProjectsTable";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectEnvironmentsPage from "./ProjectEnvironmentsPage";
import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage({ projectId, environmentId, monitorId, onNavigate }) {
  const { projects, loading, saving, error, refresh, create, update, remove } = useProjects();
  const [editing, setEditing] = useState(undefined);

  const submit = async (values) => {
    const success = editing ? await update(editing.project_id, values) : await create(values);
    if (success) setEditing(undefined);
  };
  const destroy = async (project) => {
    if (window.confirm(`Delete “${project.project_name}”? This cannot be undone.`)) await remove(project.project_id);
  };

  if (projectId) {
    const project = projects.find((item) => item.project_id === projectId);
    if (loading && !project) return <div className="content"><section className="projects-loading" aria-live="polite">Loading project…</section></div>;
    if (!project) return <div className="content resource-not-found"><p className="eyebrow">PROJECT NOT FOUND</p><h1>This project isn’t available.</h1><p className="muted">The resource may have been removed or the URL may be incorrect.</p><button className="primary" onClick={() => onNavigate("/projects")}>Return to projects</button></div>;
    return <ProjectEnvironmentsPage project={project} environmentId={environmentId} monitorId={monitorId} onBack={() => onNavigate("/projects")} onOpenEnvironment={(environment) => onNavigate(`/projects/${encodeURIComponent(project.project_id)}/environments/${encodeURIComponent(environment.environment_id)}`)} onEnvironmentBack={() => onNavigate(`/projects/${encodeURIComponent(project.project_id)}`)} onOpenMonitor={(environment, monitor) => onNavigate(`/projects/${encodeURIComponent(project.project_id)}/environments/${encodeURIComponent(environment.environment_id)}/monitors/${encodeURIComponent(monitor.monitor_id)}`)} onMonitorBack={(environment) => onNavigate(`/projects/${encodeURIComponent(project.project_id)}/environments/${encodeURIComponent(environment.environment_id)}`)} onProjectChanged={refresh} />;
  }

  return <div className="content projects-page"><div className="heading projects-heading"><div><p className="eyebrow">PROJECTS</p><h1>Your watch list.</h1><p className="muted">Create and organize the systems Watchtower keeps in view.</p></div><button className="primary new-project-button" onClick={() => setEditing(null)}>＋ New project</button></div>
    {error && <div className="projects-error" role="alert"><div><strong>We couldn’t load your projects.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div>}
    <div className="projects-toolbar"><div><strong>{projects.length}</strong><span>{projects.length === 1 ? " project" : " projects"}</span></div><button className="refresh" onClick={refresh} disabled={loading}>↻ {loading ? "Loading…" : "Refresh"}</button></div>
    {loading && projects.length === 0 ? <section className="projects-loading" aria-live="polite">Loading projects…</section> : projects.length === 0 && !error ? <section className="projects-empty"><span className="empty-symbol" aria-hidden="true">◇</span><h2>No projects yet</h2><p>Create your first project to start organizing what Watchtower monitors.</p><button className="primary" onClick={() => setEditing(null)}>Create your first project</button></section> : <ProjectsTable projects={projects} busy={saving} onOpen={(project) => onNavigate(`/projects/${encodeURIComponent(project.project_id)}`)} onEdit={setEditing} onDelete={destroy} />}
    {editing !== undefined && <ProjectForm project={editing} saving={saving} onCancel={() => setEditing(undefined)} onSubmit={submit} />}
  </div>;
}
