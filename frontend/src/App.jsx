import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import OverviewPage from "./pages/OverviewPage";
import HealthPage from "./pages/HealthPage";
import ProjectsPage from "./pages/ProjectsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { getCurrentUser, logout } from "./services/auth";
import { useHealthStatus } from "./hooks/useHealthStatus";

function parseRoute(pathname) {
  const segments = pathname.split("/").filter(Boolean).map((segment) => decodeURIComponent(segment));
  if (segments[0] === "projects") {
    return {
      page: "projects",
      projectId: segments[1] || null,
      environmentId: segments[2] === "environments" ? segments[3] || null : null,
    };
  }
  if (segments[0] === "health") return { page: "health", projectId: null, environmentId: null };
  return { page: "overview", projectId: null, environmentId: null };
}

const pagePaths = { overview: "/", projects: "/projects", health: "/health" };

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const health = useHealthStatus();
  useEffect(() => {
    const legacyPage = window.location.hash.slice(1);
    if (pagePaths[legacyPage]) {
      window.history.replaceState({}, "", pagePaths[legacyPage]);
      setRoute(parseRoute(pagePaths[legacyPage]));
    }
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const navigate = (target) => {
    const path = pagePaths[target] || target;
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const signOut = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  };
  if (loading) return <main className="loading">Loading Watchtower…</main>;
  if (!user) return <AuthPage onLogin={setUser} />;
  return (
    <DashboardLayout user={user} page={route.page} onNavigate={navigate} onLogout={signOut}>
      {route.page === "projects" && <ProjectsPage projectId={route.projectId} environmentId={route.environmentId} onNavigate={navigate} />}
      {route.page === "health" && <HealthPage {...health} />}
      {route.page === "overview" && <OverviewPage user={user} onNavigate={navigate} />}
    </DashboardLayout>
  );
}
