import { useEffect, useState } from "react";

export default function MonitorForm({ monitor, saving, error, onCancel, onSubmit }) {
  const [values, setValues] = useState({ name: "", tag: "", url: "", description: "" });
  useEffect(() => {
    setValues({
      name: monitor?.monitor_name || "",
      tag: monitor?.monitor_tag || "",
      url: monitor?.monitor_url || "",
      description: monitor?.monitor_description || "",
    });
  }, [monitor]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ name: values.name.trim(), tag: values.tag.trim(), url: values.url.trim(), description: values.description.trim() || null });
  };

  return <div className="project-form-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onCancel(); }}><section className="project-form-panel monitor-form-panel" role="dialog" aria-modal="true" aria-labelledby="monitor-form-title"><div className="project-form-heading"><div><p className="eyebrow">{monitor ? "EDIT MONITOR" : "NEW MONITOR"}</p><h2 id="monitor-form-title">{monitor ? "Update monitor" : "Create a monitor"}</h2></div><button type="button" className="close-button" onClick={onCancel} disabled={saving} aria-label="Close monitor form">×</button></div><p className="form-intro">Define the endpoint Watchtower should monitor in this environment.</p><form onSubmit={submit}><label>Monitor name<input autoFocus required maxLength="120" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Public API" /></label><div className="monitor-form-row"><label>Tag<input required maxLength="80" value={values.tag} onChange={(event) => setValues({ ...values, tag: event.target.value })} placeholder="api" /></label><label>URL<input type="url" required value={values.url} onChange={(event) => setValues({ ...values, url: event.target.value })} placeholder="https://api.example.com/health" /></label></div><label>Description <span>Optional</span><textarea rows="4" maxLength="1000" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="Customer-facing API health endpoint" /></label>{error && <p className="environment-form-error" role="alert">{error}</p>}<div className="project-form-actions"><button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>Cancel</button><button className="primary project-submit" disabled={saving || !values.name.trim() || !values.tag.trim() || !values.url.trim()}>{saving ? "Saving…" : monitor ? "Save changes" : "Create monitor"}</button></div></form></section></div>;
}
