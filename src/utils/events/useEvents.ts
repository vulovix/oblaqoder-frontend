import { useEffect } from "react";
import { eventBus, type EventCallback } from "./ClassEventBus";

// Returns the singleton event bus instance.
export function useEvents() {
  return eventBus;
}

// Automatically registers an event listener and cleans up on unmount.
export function useEvent<T = any>(event: string, callback: EventCallback<T>): void {
  useEffect(() => {
    eventBus.on<T>(event, callback);
    return () => {
      eventBus.off<T>(event, callback);
    };
  }, [event, callback]);
}
