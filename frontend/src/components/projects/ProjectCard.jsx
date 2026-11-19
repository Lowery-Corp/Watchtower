function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function ProjectCard({ project, busy, onEdit, onDelete }) {
  const updated = formatDate(project.updated_at || project.created_at);
  return <article className="project-card">
    <div className="project-card-top"><span className="project-symbol" aria-hidden="true">◇</span><div className="project-actions"><button onClick={() => onEdit(project)} disabled={busy}>Edit</button><button className="danger" onClick={() => onDelete(project)} disabled={busy}>Delete</button></div></div>
    <h2>{project.project_name}</h2>
    <p>{project.project_description || "No description yet."}</p>
    <footer><span>{updated ? `Updated ${updated}` : "Watchtower project"}</span>{project.project_id && <code title={project.project_id}>{project.project_id.slice(0, 8)}</code>}</footer>
  </article>;
}
