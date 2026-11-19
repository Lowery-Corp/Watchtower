function environmentCount(project) {
  return project.environments && typeof project.environments === "object" ? Object.keys(project.environments).length : 0;
}

export default function ProjectsTable({ projects, busy, onOpen, onEdit, onDelete }) {
  const open = (event, project) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onOpen(project); };
  return <div className="resource-table-wrap"><table className="resource-table projects-table"><thead><tr><th>Project</th><th>Description</th><th>Environments</th><th>Resource ID</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{projects.map((project) => { const href = `/projects/${encodeURIComponent(project.project_id)}`; return <tr key={project.project_id || project.project_name}><td><a className="resource-name" href={href} onClick={(event) => open(event, project)}>{project.project_name}</a></td><td className="resource-description">{project.project_description || "No description provided."}</td><td><span className="count-badge">{environmentCount(project)}</span></td><td><code className="resource-id" title={project.project_id}>{project.project_id}</code></td><td><div className="table-actions"><a href={href} onClick={(event) => open(event, project)}>Open</a><button onClick={() => onEdit(project)} disabled={busy}>Edit</button><button className="danger" onClick={() => onDelete(project)} disabled={busy}>Delete</button></div></td></tr>; })}</tbody></table></div>;
}
