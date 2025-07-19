// EventBus.ts
export type EventCallback<T = any> = (payload: T) => void;

export class EventBus {
  private listeners: Map<string, Set<EventCallback<any>>> = new Map();

  // Register a listener for an event.
  on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  // Unregister a listener for an event.
  off<T = any>(event: string, callback: EventCallback<T>): void {
    this.listeners.get(event)?.delete(callback);
  }

  // Dispatch an event with an optional payload.
  emit<T = any>(event: string, payload?: T): void {
    this.listeners.get(event)?.forEach((callback) => callback(payload as T));
  }
}

// Create a singleton instance to be shared throughout the app.
export const eventBus = new EventBus();
