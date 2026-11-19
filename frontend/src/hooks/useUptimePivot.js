import { useCallback, useEffect, useState } from "react";
import { getUptimePivot } from "../services/uptime";

const emptyPivot = {
  projects: [],
  summary: { projectCount: 0, environmentCount: 0, monitorCount: 0, sampleCount: 0, uptime: null, status: null },
  partialFailures: 0,
};

export function useUptimePivot() {
  const [pivot, setPivot] = useState(emptyPivot);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      setPivot(await getUptimePivot());
    } catch (err) {
      setError(err.message || "The uptime overview could not be loaded.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(false), 15000);
    return () => clearInterval(timer);
  }, [load]);

  return { ...pivot, loading, error, refresh: () => load(true) };
}
