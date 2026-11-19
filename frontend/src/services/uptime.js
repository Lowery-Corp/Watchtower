import { listProjects } from "./projects";
import { normalizeEnvironments } from "./environments";
import { normalizeMonitors } from "./monitors";

export function summarizeMonitors(monitors) {
  const samples = monitors.flatMap((monitor) => monitor.monitor_status_history || []);
  const knownStatuses = monitors.map((monitor) => monitor.monitor_status).filter((status) => status !== null);
  return {
    monitorCount: monitors.length,
    sampleCount: samples.length,
    uptime: samples.length ? samples.filter((sample) => sample.status).length / samples.length * 100 : null,
    status: knownStatuses.some((status) => status === false)
      ? false
      : knownStatuses.length === monitors.length && knownStatuses.length > 0
        ? true
        : null,
  };
}

export function buildUptimePivot(projects) {
  const projectRows = projects.map((project) => {
    const environmentRows = normalizeEnvironments(project.environments || {}).map((environment) => {
      const monitors = normalizeMonitors(environment.monitors || {});
      return { ...environment, monitors, summary: summarizeMonitors(monitors) };
    });

    const monitors = environmentRows.flatMap((environment) => environment.monitors);
    return { ...project, environments: environmentRows, summary: summarizeMonitors(monitors) };
  });

  const allMonitors = projectRows.flatMap((project) => project.environments.flatMap((environment) => environment.monitors));
  return {
    projects: projectRows,
    summary: {
      ...summarizeMonitors(allMonitors),
      projectCount: projectRows.length,
      environmentCount: projectRows.reduce((total, project) => total + project.environments.length, 0),
    },
  };
}

export async function getUptimePivot(options) {
  return buildUptimePivot(await listProjects(options));
}
