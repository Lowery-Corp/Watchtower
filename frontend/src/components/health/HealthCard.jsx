export default function HealthCard({ label, path, state }) {
  return <article className="card"><div className="card-head"><span className="service-icon">⌁</span><span className={`pill ${state?.ok ? "up" : state ? "down" : "waiting"}`}>{state?.ok ? "Operational" : state ? "Unavailable" : "Checking"}</span></div><h3>{label}</h3><p>{state?.message || "Contacting service…"}</p><code>{path}</code></article>;
}
