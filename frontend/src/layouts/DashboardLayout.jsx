export default function DashboardLayout({ children, user, page, onNavigate, onLogout }) {
  const link = (event, target) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(target);
  };
  return <main className="dashboard"><header><a className="wordmark" href="/" onClick={(event) => link(event, "overview")}><span className="logo small">◈</span> watchtower</a><nav aria-label="Primary navigation"><a className={page === "overview" ? "active" : ""} href="/" onClick={(event) => link(event, "overview")}>Overview</a><a className={page === "projects" ? "active" : ""} href="/projects" onClick={(event) => link(event, "projects")}>Projects</a><a className={page === "health" ? "active" : ""} href="/health" onClick={(event) => link(event, "health")}>Service health</a></nav><div className="account">{user?.username}<button onClick={onLogout}>Sign out</button></div></header>{children}<footer>WATCHTOWER <span>API v1 · built for calm operations</span></footer></main>;
}
