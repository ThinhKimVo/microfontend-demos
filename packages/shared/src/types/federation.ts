export interface RemoteConfig {
  name: string;
  url: string;
  scope: string;
  module: string;
}

export interface MountFunction {
  (container: HTMLElement): { unmount: () => void } | Promise<{ destroy: () => void }>;
}

export interface RemoteModule {
  default?: MountFunction;
  mount?: MountFunction;
}

export interface GlobalState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
}

export interface NotificationPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface NavigationPayload {
  path: string;
  params?: Record<string, string>;
}
