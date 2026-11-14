import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import OverviewPage from "./pages/OverviewPage";
import HealthPage from "./pages/HealthPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { getCurrentUser, logout } from "./services/auth";
import { useHealthStatus } from "./hooks/useHealthStatus";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => (window.location.hash === "#health" ? "health" : "overview"));
  const health = useHealthStatus();
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const navigate = (nextPage) => {
    setPage(nextPage);
    window.history.replaceState({}, "", nextPage === "health" ? "#health" : "#overview");
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
      {page === "health" ? <HealthPage {...health} /> : <OverviewPage user={user} onNavigate={navigate} />}
    </DashboardLayout>
  );
}
