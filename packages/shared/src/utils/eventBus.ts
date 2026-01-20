type EventCallback<T = unknown> = (data: T) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  subscribe<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback as EventCallback);

    return () => {
      this.events.get(event)?.delete(callback as EventCallback);
    };
  }

  publish<T = unknown>(event: string, data: T): void {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

export const EVENTS = {
  AUTH_CHANGED: 'auth:changed',
  THEME_CHANGED: 'theme:changed',
  NAVIGATION: 'navigation:request',
  NOTIFICATION: 'notification:show',
  USER_UPDATED: 'user:updated',
} as const;

declare global {
  interface Window {
    __MFE_EVENT_BUS__: EventBus;
  }
}

export const eventBus =
  typeof window !== 'undefined'
    ? window.__MFE_EVENT_BUS__ || new EventBus()
    : new EventBus();

if (typeof window !== 'undefined') {
  window.__MFE_EVENT_BUS__ = eventBus;
}

export default eventBus;
