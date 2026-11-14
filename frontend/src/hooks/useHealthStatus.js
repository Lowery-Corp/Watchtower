import { useCallback, useEffect, useState } from "react";
import { checkHealth } from "../services/health";

export function useHealthStatus() {
  const [statuses, setStatuses] = useState({});
  const [checked, setChecked] = useState(null);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    setStatuses(await checkHealth());
    setChecked(new Date());
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); const timer = setInterval(refresh, 600000); return () => clearInterval(timer); }, [refresh]);
  return { statuses, checked, loading, refresh };
}
