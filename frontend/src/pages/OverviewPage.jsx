import UptimePivot from "../components/uptime/UptimePivot";
import { useUptimePivot } from "../hooks/useUptimePivot";

export default function OverviewPage({ user, onNavigate }) {
  const { projects, summary, loading, error, refreshingMonitors, refresh, refreshMonitor } = useUptimePivot();
  return <div className="content"><div className="heading"><div><p className="eyebrow">SYSTEM OVERVIEW</p><h1>Good to see you, <em>{user?.username?.split("@")[0]}</em>.</h1><p className="muted">Your essential services, at a glance.</p></div><button className="refresh" onClick={() => onNavigate("health")}>View service health</button></div>
    <section className="uptime-overview" aria-labelledby="uptime-heading"><div className="uptime-overview-heading"><div><p className="eyebrow">UPTIME PIVOT</p><h2 id="uptime-heading">Projects, environments, and monitors</h2><p>Monitor health rolls up through every level of your Watchtower hierarchy.</p></div><button className="refresh" onClick={refresh} disabled={loading}>↻ {loading ? "Loading…" : "Refresh"}</button></div>
      <div className="uptime-totals"><div><strong>{summary.projectCount}</strong><span>Projects</span></div><div><strong>{summary.environmentCount}</strong><span>Environments</span></div><div><strong>{summary.monitorCount}</strong><span>Monitors</span></div><div><strong>{summary.uptime === null ? "—" : `${summary.uptime.toFixed(2)}%`}</strong><span>Recorded uptime</span></div></div>
      {error && <div className="projects-error" role="alert"><div><strong>We couldn’t load the uptime pivot.</strong><span>{error}</span></div><button onClick={refresh}>Try again</button></div>}
      {loading && projects.length === 0 ? <section className="projects-loading" aria-live="polite">Loading uptime hierarchy…</section> : projects.length === 0 && !error ? <section className="projects-empty"><h2>No uptime data yet</h2><p>Create a project, environment, and monitor to populate this view.</p><button className="primary" onClick={() => onNavigate("projects")}>Go to projects</button></section> : <UptimePivot projects={projects} onRefreshMonitor={refreshMonitor} refreshingMonitors={refreshingMonitors} />}
    </section>
  </div>;
}
