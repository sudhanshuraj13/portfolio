import type { WebSocket } from "ws";

export type LogLevel = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "SYSTEM";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

/** Set of all connected WebSocket clients */
export const clients = new Set<WebSocket>();

/** Broadcast a structured log entry to all connected clients */
export function broadcast(entry: LogEntry): void {
  const payload = JSON.stringify(entry);
  for (const ws of clients) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
}

/** Convenience: broadcast + await a delay for realistic streaming */
export async function streamLog(
  level: LogLevel,
  source: string,
  message: string,
  delayMs = 150
): Promise<void> {
  broadcast({
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
  });
  if (delayMs > 0) {
    await sleep(delayMs);
  }
}

import { prisma } from "./db.js";

/** Record to DB and stream to WebSockets simultaneously */
export async function recordSystemLog(
  trace_id: string,
  level: LogLevel,
  microservice: string,
  action: string,
  message: string,
  latency_ms: number,
  status: "SUCCESS" | "ERROR",
  metadata?: any,
  delayMs = 150
): Promise<void> {
  // Stream to UI terminal
  await streamLog(level, microservice, `[TRACE: ${trace_id}] ${message}`, delayMs);

  // Save to PostgreSQL
  try {
    await prisma.systemLog.create({
      data: {
        trace_id,
        microservice,
        action,
        latency_ms,
        status,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (e) {
    console.error("[DB_ERROR] Failed to save SystemLog:", e);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
