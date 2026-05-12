import { useEffect, useRef, useCallback, useState } from "react";

type EventHandler = (data: any) => void;

interface UseEventStreamOptions {
  url: string;
  onEvent?: (event: string, data: any) => void;
  handlers?: Record<string, EventHandler>;
  enabled?: boolean;
}

export function useEventStream({ url, onEvent, handlers, enabled = true }: UseEventStreamOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlersRef = useRef(handlers);
  const onEventRef = useRef(onEvent);
  const [isConnected, setIsConnected] = useState(false);

  handlersRef.current = handlers;
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (!url || url.includes("undefined") || url.includes("null")) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          const event = parsed.event;
          const data = parsed.data;
          onEventRef.current?.(event, data);
          handlersRef.current?.[event]?.(data);
        } catch {}
      };

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        eventSourceRef.current = null;

        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };
    } catch (error) {
      console.error("EventSource connection error:", error);
    }
  }, [url, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setIsConnected(false);
    };
  }, [enabled, connect]);

  return { isConnected };
}