import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import OverviewPage from "./pages/OverviewPage";
import HealthPage from "./pages/HealthPage";
import ProjectsPage from "./pages/ProjectsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { getCurrentUser, logout } from "./services/auth";
import { useHealthStatus } from "./hooks/useHealthStatus";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return ["overview", "projects", "health"].includes(hash) ? hash : "overview";
  });
  const health = useHealthStatus();
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const navigate = (nextPage) => {
    setPage(nextPage);
    window.history.replaceState({}, "", `#${nextPage}`);
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
    <DashboardLayout user={user} page={page} onNavigate={navigate} onLogout={signOut}>
      {page === "projects" && <ProjectsPage />}
      {page === "health" && <HealthPage {...health} />}
      {page === "overview" && <OverviewPage user={user} onNavigate={navigate} />}
    </DashboardLayout>
  );
}
