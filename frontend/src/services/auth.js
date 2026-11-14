import { api } from "./api";

export const getCurrentUser = () => api("/api/v1/auth/me");
export const login = (credentials) => api("/api/v1/auth/login", { method: "POST", body: JSON.stringify(credentials) });
export const register = (credentials) => api("/api/v1/auth/register", { method: "POST", body: JSON.stringify(credentials) });
export const logout = () => api("/api/v1/auth/logout", { method: "POST" });
