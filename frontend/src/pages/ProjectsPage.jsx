import { useState } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {
  const { projects, loading, saving, error, refresh, create, update, remove } = useProjects();
  const [editing, setEditing] = useState(undefined);

  const submit = async (values) => {
    const success = editing ? await update(editing.project_id, values) : await create(values);
    if (success) setEditing(undefined);
  };
  const destroy = async (project) => {
    if (window.confirm(`Delete “${project.project_name}”? This cannot be undone.`)) await remove(project.project_id);
  };

  return <div className="content projects-page"><div className="heading projects-heading"><div><p className="eyebrow">PROJECTS</p><h1>Your watch list.</h1><p className="muted">Create and organize the systems Watchtower keeps in view.</p></div><button className="primary new-project-button" onClick={() => setEditing(null)}>＋ New project</button></div>
    {error && <div className="projects-error" role="alert"><div><strong>We couldn’t load your projects.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div>}
    <div className="projects-toolbar"><div><strong>{projects.length}</strong><span>{projects.length === 1 ? " project" : " projects"}</span></div><button className="refresh" onClick={refresh} disabled={loading}>↻ {loading ? "Loading…" : "Refresh"}</button></div>
    {loading && projects.length === 0 ? <section className="projects-loading" aria-live="polite">Loading projects…</section> : projects.length === 0 && !error ? <section className="projects-empty"><span className="empty-symbol" aria-hidden="true">◇</span><h2>No projects yet</h2><p>Create your first project to start organizing what Watchtower monitors.</p><button className="primary" onClick={() => setEditing(null)}>Create your first project</button></section> : <section className="projects-grid">{projects.map((project) => <ProjectCard key={project.project_id || project.project_name} project={project} busy={saving} onEdit={setEditing} onDelete={destroy} />)}</section>}
    {editing !== undefined && <ProjectForm project={editing} saving={saving} onCancel={() => setEditing(undefined)} onSubmit={submit} />}
  </div>;
}
