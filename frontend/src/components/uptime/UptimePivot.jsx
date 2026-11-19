import { Fragment, useState } from "react";
import { MonitorStatusBadge } from "../monitors/MonitorUptimeSubrow";

function formatUptime(uptime) {
  return uptime === null ? "No history" : `${uptime.toFixed(2)}%`;
}

function UptimeValue({ uptime }) {
  const width = uptime === null ? 0 : Math.max(0, Math.min(100, uptime));
  const tone = uptime === null ? "unknown" : uptime >= 99 ? "good" : uptime >= 95 ? "warning" : "bad";
  return <div className="pivot-uptime"><div className="pivot-uptime-track" aria-hidden="true"><span className={tone} style={{ width: `${width}%` }} /></div><strong>{formatUptime(uptime)}</strong></div>;
}

function PivotName({ level, href, name, detail, expanded, onToggle, hasChildren }) {
  return <div className={`pivot-name level-${level}`}>
    {hasChildren ? <button className="pivot-toggle" type="button" onClick={onToggle} aria-expanded={expanded} aria-label={`${expanded ? "Collapse" : "Expand"} ${name}`}>{expanded ? "−" : "+"}</button> : <span className="pivot-leaf" aria-hidden="true" />}
    <div><a href={href}>{name}</a><span>{detail}</span></div>
  </div>;
}

function SummaryCells({ summary }) {
  return <><td><MonitorStatusBadge status={summary.status} /></td><td><UptimeValue uptime={summary.uptime} /></td><td className="pivot-number">{summary.sampleCount.toLocaleString()}</td></>;
}

export default function UptimePivot({ projects }) {
  const [collapsed, setCollapsed] = useState(new Set());
  const toggle = (key) => setCollapsed((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  return <div className="uptime-pivot-wrap"><table className="uptime-pivot-table">
    <thead><tr><th>Project / Environment / Monitor</th><th>Current</th><th>Recorded uptime</th><th>Checks</th></tr></thead>
    <tbody>{projects.map((project) => {
      const projectKey = `project:${project.project_id}`;
      const projectExpanded = !collapsed.has(projectKey);
      return <Fragment key={projectKey}>
        <tr className="pivot-project-row"><th scope="row"><PivotName level={0} href={`/projects/${encodeURIComponent(project.project_id)}`} name={project.project_name} detail={`${project.environments.length} ${project.environments.length === 1 ? "environment" : "environments"}`} expanded={projectExpanded} onToggle={() => toggle(projectKey)} hasChildren={project.environments.length > 0} /></th><SummaryCells summary={project.summary} /></tr>
        {projectExpanded && project.environments.map((environment) => {
          const environmentKey = `environment:${environment.environment_id}`;
          const environmentExpanded = !collapsed.has(environmentKey);
          const environmentHref = `/projects/${encodeURIComponent(project.project_id)}/environments/${encodeURIComponent(environment.environment_id)}`;
          return <Fragment key={environmentKey}>
            <tr className="pivot-environment-row"><th scope="row"><PivotName level={1} href={environmentHref} name={environment.environment_name} detail={`${environment.monitors.length} ${environment.monitors.length === 1 ? "monitor" : "monitors"}`} expanded={environmentExpanded} onToggle={() => toggle(environmentKey)} hasChildren={environment.monitors.length > 0} /></th><SummaryCells summary={environment.summary} /></tr>
            {environmentExpanded && environment.monitors.map((monitor) => {
              const monitorHref = `${environmentHref}/monitors/${encodeURIComponent(monitor.monitor_id)}`;
              const history = monitor.monitor_status_history || [];
              const uptime = history.length ? history.filter((sample) => sample.status).length / history.length * 100 : null;
              return <tr className="pivot-monitor-row" key={`monitor:${monitor.monitor_id}`}><th scope="row"><PivotName level={2} href={monitorHref} name={monitor.monitor_name} detail={monitor.monitor_url} hasChildren={false} /></th><SummaryCells summary={{ status: monitor.monitor_status, uptime, sampleCount: history.length }} /></tr>;
            })}
          </Fragment>;
        })}
      </Fragment>;
    })}</tbody>
  </table></div>;
}
