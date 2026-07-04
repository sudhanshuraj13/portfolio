import { create } from "zustand";

export type LogLevel = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "SYSTEM";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  trace_id?: string;
}

export type ModuleId = "argus" | "llm-gateway" | "rag-sandbox" | "graph-validator";

interface LogState {
  logs: LogEntry[];
  activeModule: ModuleId;
  wsConnected: boolean;
  artifacts: Record<string, any>;
  addArtifact: (trace_id: string, payload: any) => void;
  addLog: (entry: Omit<LogEntry, "id">) => void;
  clearLogs: () => void;
  setActiveModule: (mod: ModuleId) => void;
  setWsConnected: (connected: boolean) => void;
}

let logCounter = 0;

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  activeModule: "argus",
  wsConnected: false,
  artifacts: {},

  addArtifact: (trace_id, payload) =>
    set((state) => ({
      artifacts: { ...state.artifacts, [trace_id]: payload },
    })),

  addLog: (entry) =>
    set((state) => ({
      logs: [
        ...state.logs,
        { ...entry, id: `log-${++logCounter}-${Date.now()}` },
      ].slice(-500), // Keep last 500 logs to prevent memory bloat
    })),

  clearLogs: () => set({ logs: [] }),

  setActiveModule: (mod) => set({ activeModule: mod }),

  setWsConnected: (connected) => set({ wsConnected: connected }),
}));
