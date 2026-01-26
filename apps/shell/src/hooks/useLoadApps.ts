import { useState, useEffect } from 'react';
import { AppInfo } from '../data/apps';
import { loadApps } from '../services/appsService';

interface UseLoadAppsReturn {
  apps: AppInfo[];
  loading: boolean;
  reload: () => void;
}

export function useLoadApps(): UseLoadAppsReturn {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    loadApps().then((data) => {
      setApps(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  return { apps, loading, reload };
}
