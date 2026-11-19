import { useEffect, useState } from "react";

export default function EnvironmentForm({ environment, saving, error, onCancel, onSubmit }) {
  const [values, setValues] = useState({ environment_name: "", environment_description: "" });
  useEffect(() => {
    setValues({
      environment_name: environment?.environment_name || "",
      environment_description: environment?.environment_description || "",
    });
  }, [environment]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      environment_name: values.environment_name.trim(),
      environment_description: values.environment_description.trim() || null,
    });
  };

  return <div className="project-form-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onCancel(); }}><section className="project-form-panel environment-form-panel" role="dialog" aria-modal="true" aria-labelledby="environment-form-title"><div className="project-form-heading"><div><p className="eyebrow">{environment ? "EDIT ENVIRONMENT" : "NEW ENVIRONMENT"}</p><h2 id="environment-form-title">{environment ? "Update environment" : "Create an environment"}</h2></div><button type="button" className="close-button" onClick={onCancel} disabled={saving} aria-label="Close environment form">×</button></div><p className="form-intro">Environments separate the deployment contexts within this project.</p><form onSubmit={submit}><label>Environment name<input autoFocus required maxLength="120" value={values.environment_name} onChange={(event) => setValues({ ...values, environment_name: event.target.value })} placeholder="Production" /></label><label>Description <span>Optional</span><textarea rows="5" maxLength="1000" value={values.environment_description} onChange={(event) => setValues({ ...values, environment_description: event.target.value })} placeholder="Primary customer-facing deployment" /></label>{error && <p className="environment-form-error" role="alert">{error}</p>}<div className="project-form-actions"><button type="button" className="secondary-button" onClick={onCancel} disabled={saving}>Cancel</button><button className="primary project-submit" disabled={saving || !values.environment_name.trim()}>{saving ? "Saving…" : environment ? "Save changes" : "Create environment"}</button></div></form></section></div>;
}
