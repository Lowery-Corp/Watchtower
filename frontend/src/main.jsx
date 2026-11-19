import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/header.css";
import "./styles/health.css";
import "./styles/projects.css";
import "./styles/environments.css";
import "./styles/tables.css";
import "./styles/monitors.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
