"use client";

import { useEffect, useRef, useCallback } from "react";
import { useLogStore } from "@/store/useLogStore";

const getWsUrl = () => {
  if (typeof window === "undefined") return "ws://localhost:4000/ws";
  const raw = process.env.NEXT_PUBLIC_WS_URL;
  if (!raw) return `ws://${window.location.hostname}:4000/ws`;
  
  // Clean up trailing slash and ensure it ends with /ws
  const clean = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  return clean.endsWith('/ws') ? clean : `${clean}/ws`;
};

const WS_URL = getWsUrl();

const MAX_RECONNECT_DELAY = 10000;
const BASE_RECONNECT_DELAY = 1000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addLog = useLogStore((s) => s.addLog);
  const setWsConnected = useLogStore((s) => s.setWsConnected);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.timestamp && data.level && data.source && data.message) {
            addLog(data);
          }
        } catch {
          // Non-JSON messages ignored
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        wsRef.current = null;

        // Exponential backoff reconnect
        const delay = Math.min(
          BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttemptRef.current),
          MAX_RECONNECT_DELAY
        );
        reconnectAttemptRef.current++;
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = (event) => {
        console.error("[WS] Connection Error:", event);
        ws.close();
      };
    } catch (error) {
      console.error("[WS] Failed to instantiate WebSocket:", error);
      // Connection failed, will retry via onclose
    }
  }, [addLog, setWsConnected]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
}
