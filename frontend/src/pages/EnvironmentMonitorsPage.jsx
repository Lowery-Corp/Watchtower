import { useState } from "react";
import EnvironmentDetails from "../components/environments/EnvironmentDetails";
import MonitorDetails from "../components/monitors/MonitorDetails";
import MonitorForm from "../components/monitors/MonitorForm";
import MonitorsTable from "../components/monitors/MonitorsTable";
import { useMonitors } from "../hooks/useMonitors";

export default function EnvironmentMonitorsPage({ project, environment, monitorId, onBack, onOpenMonitor, onMonitorBack, onEditEnvironment, onEnvironmentChanged }) {
  const { monitors, loading, saving, error, refresh, create, update, remove } = useMonitors(project.project_id, environment.environment_id);
  const [editing, setEditing] = useState(undefined);

  const submit = async (values) => {
    const success = editing ? await update(editing.monitor_id, values) : await create(values);
    if (success) { setEditing(undefined); await onEnvironmentChanged?.(); }
  };
  const destroy = async (monitor) => {
    if (!window.confirm(`Delete “${monitor.monitor_name}”? This cannot be undone.`)) return;
    const success = await remove(monitor.monitor_id);
    if (success) { await onEnvironmentChanged?.(); if (monitorId) onMonitorBack(); }
  };

  if (monitorId) {
    const monitor = monitors.find((item) => item.monitor_id === monitorId);
    if (loading && !monitor) return <section className="projects-loading" aria-live="polite">Loading monitor…</section>;
    if (error && !monitor) return <section className="resource-not-found"><button className="back-button" onClick={onMonitorBack}>Back to monitors</button><div className="projects-error" role="alert"><div><strong>We couldn’t load this monitor.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div></section>;
    if (!monitor) return <section className="resource-not-found"><button className="back-button" onClick={onMonitorBack}>Back to monitors</button><p className="eyebrow">MONITOR NOT FOUND</p><h1>This monitor isn’t available.</h1><p className="muted">The resource may have been removed or the URL may be incorrect.</p></section>;
    return <><button className="back-button" onClick={onMonitorBack}>Back to monitors</button><MonitorDetails monitor={monitor} busy={saving} onEdit={setEditing} onDelete={destroy} />{editing !== undefined && <MonitorForm monitor={editing} saving={saving} error={error} onCancel={() => setEditing(undefined)} onSubmit={submit} />}</>;
  }

  return <><button className="back-button" onClick={onBack}>Back to environments</button><EnvironmentDetails environment={environment} onEdit={onEditEnvironment} /><section className="monitors-section"><div className="monitors-heading"><div><p className="eyebrow">ENVIRONMENT MONITORS</p><h2>Monitored endpoints</h2><p>Endpoints configured for this environment.</p></div><button className="primary new-project-button" onClick={() => setEditing(null)}>＋ New monitor</button></div>{error && editing === undefined && <div className="projects-error" role="alert"><div><strong>We couldn’t load the monitors.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div>}<div className="environment-summary"><div><strong>{monitors.length}</strong><span>{monitors.length === 1 ? " monitor" : " monitors"}</span></div><button className="refresh" onClick={refresh} disabled={loading}>↻ {loading ? "Loading…" : "Refresh"}</button></div>{loading && monitors.length === 0 ? <section className="projects-loading" aria-live="polite">Loading monitors…</section> : monitors.length === 0 && !error ? <section className="projects-empty"><span className="empty-symbol monitor-empty-symbol" aria-hidden="true">⌁</span><h2>No monitors yet</h2><p>Add an endpoint to begin building this environment’s monitor inventory.</p><button className="primary" onClick={() => setEditing(null)}>Create your first monitor</button></section> : <MonitorsTable projectId={project.project_id} environmentId={environment.environment_id} monitors={monitors} busy={saving} onOpen={onOpenMonitor} onEdit={setEditing} onDelete={destroy} />}</section>{editing !== undefined && <MonitorForm monitor={editing} saving={saving} error={error} onCancel={() => setEditing(undefined)} onSubmit={submit} />}</>;
}
