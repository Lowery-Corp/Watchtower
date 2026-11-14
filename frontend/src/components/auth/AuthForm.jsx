import { useState } from "react";
import { apiUrl } from "../../services/api";
import { getCurrentUser, login, register } from "../../services/auth";

export default function AuthForm({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await (isRegistering ? register(form) : login(form)); onLogin(await getCurrentUser()); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <section className="auth-card"><div className="logo">◈</div><p className="eyebrow">WATCHTOWER / CONTROL ROOM</p><h1>{isRegistering ? "Start watching." : "Welcome back."}</h1><p className="muted">A calm, clear view of the services you care about.</p><div className="tabs"><button className={!isRegistering ? "active" : ""} onClick={() => setIsRegistering(false)}>Sign in</button><button className={isRegistering ? "active" : ""} onClick={() => setIsRegistering(true)}>Create account</button></div><form onSubmit={submit}><label>Email<input type="email" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="you@company.com" /></label><label>Password<input type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label>{error && <p className="error">{error}</p>}<button className="primary" disabled={busy}>{busy ? "Connecting…" : isRegistering ? "Create account →" : "Enter Watchtower →"}</button></form><small>API: {apiUrl}</small></section>;
}
