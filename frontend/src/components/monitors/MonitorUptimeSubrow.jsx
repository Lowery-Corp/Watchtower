function toDate(timestamp) {
  const milliseconds = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTimestamp(timestamp) {
  const date = toDate(timestamp);
  if (!date) return "Unknown time";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(date);
}

export function MonitorStatusBadge({ status }) {
  const label = status === true ? "Up" : status === false ? "Down" : "Pending";
  const className = status === true ? "up" : status === false ? "down" : "pending";
  return <span className={`monitor-status-badge ${className}`}><span />{label}</span>;
}

export default function MonitorUptimeSubrow({ monitor, columnCount = 6 }) {
  const history = monitor.monitor_status_history || [];
  const recentHistory = history.slice(0, 25);
  const upChecks = history.filter((entry) => entry.status).length;
  const uptime = history.length ? `${((upChecks / history.length) * 100).toFixed(1)}%` : "—";

  return <tr className="uptime-subrow"><td colSpan={columnCount}><div className="uptime-panel"><div className="uptime-summary"><div><span>Current status</span><MonitorStatusBadge status={monitor.monitor_status} /></div><div><span>Recorded uptime</span><strong>{uptime}</strong></div><div><span>History samples</span><strong>{history.length}</strong></div><div><span>Showing</span><strong>{recentHistory.length}{history.length > recentHistory.length ? ` of ${history.length}` : ""}</strong></div></div>{recentHistory.length === 0 ? <p className="uptime-empty">No uptime checks have been recorded yet.</p> : <div className="uptime-table-wrap"><table className="uptime-history-table"><thead><tr><th>Status</th><th>Checked at</th></tr></thead><tbody>{recentHistory.map((entry) => <tr key={entry.id}><td><MonitorStatusBadge status={entry.status} /></td><td><time dateTime={toDate(entry.timestamp)?.toISOString()}>{formatTimestamp(entry.timestamp)}</time></td></tr>)}</tbody></table></div>}</div></td></tr>;
}
