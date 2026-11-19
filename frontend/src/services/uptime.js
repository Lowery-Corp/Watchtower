import { listProjects } from "./projects";
import { listEnvironments } from "./environments";
import { listMonitors } from "./monitors";

function summarize(monitors) {
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

export async function getUptimePivot() {
  const projects = await listProjects();
  let partialFailures = 0;

  const projectRows = await Promise.all(projects.map(async (project) => {
    let environments = [];
    try {
      environments = await listEnvironments(project.project_id);
    } catch {
      partialFailures += 1;
    }

    const environmentRows = await Promise.all(environments.map(async (environment) => {
      let monitors = [];
      try {
        monitors = await listMonitors(project.project_id, environment.environment_id);
      } catch {
        partialFailures += 1;
      }
      return { ...environment, monitors, summary: summarize(monitors) };
    }));

    const monitors = environmentRows.flatMap((environment) => environment.monitors);
    return { ...project, environments: environmentRows, summary: summarize(monitors) };
  }));

  const allMonitors = projectRows.flatMap((project) => project.environments.flatMap((environment) => environment.monitors));
  return {
    projects: projectRows,
    summary: {
      ...summarize(allMonitors),
      projectCount: projectRows.length,
      environmentCount: projectRows.reduce((total, project) => total + project.environments.length, 0),
    },
    partialFailures,
  };
}
