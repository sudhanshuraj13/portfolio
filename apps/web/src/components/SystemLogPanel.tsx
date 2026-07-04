"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Trash2, Activity, RefreshCw } from "lucide-react";
import { useLogStore, type LogLevel } from "@/store/useLogStore";

const LEVEL_COLORS: Record<LogLevel, string> = {
  INFO: "text-muted",
  WARN: "text-amber",
  ERROR: "text-error",
  SUCCESS: "text-terminal-green",
  SYSTEM: "text-info",
};

const LEVEL_BG: Record<LogLevel, string> = {
  INFO: "",
  WARN: "bg-amber/5",
  ERROR: "bg-error/5",
  SUCCESS: "",
  SYSTEM: "bg-info/5",
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + "." + String(d.getMilliseconds()).padStart(3, "0");
  } catch {
    return "00:00:00.000";
  }
}

interface TelemetryData {
  total_logs: number;
  success_rate: number;
  p99_latency_ms: number;
  queue_depth: number;
  llm_tokens_used: number;
  estimated_llm_cost_usd: number;
}

export function SystemLogPanel() {
  const [activeTab, setActiveTab] = useState<"TRACES" | "TELEMETRY">("TRACES");
  const logs = useLogStore((s) => s.logs);
  const clearLogs = useLogStore((s) => s.clearLogs);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (activeTab === "TRACES" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  const fetchTelemetry = async () => {
    setIsLoadingTelemetry(true);
    try {
      const res = await fetch("/api/telemetry");
      const data = await res.json();
      if (data.status === "OK") {
        setTelemetry(data);
      }
    } catch (err) {
      console.error("Failed to fetch telemetry", err);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    if (activeTab === "TELEMETRY") {
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const [height, setHeight] = useState(256); // Default 256px (h-64 equivalent)
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newHeight = window.innerHeight - e.clientY;
    const boundedHeight = Math.max(40, Math.min(newHeight, window.innerHeight * 0.8));
    setHeight(boundedHeight);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    // Cleanup listeners just in case
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div 
      style={{ height: `${height}px` }} 
      className="bg-surface-alt flex flex-col select-none relative"
    >
      {/* Drag Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-info/30 z-10 -translate-y-1/2 transition-colors flex items-center justify-center group"
      >
        <div className="w-10 h-0.5 bg-border group-hover:bg-info/50 rounded-full" />
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-b border-border bg-base/50 mt-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("TRACES")}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono transition-colors ${
              activeTab === "TRACES" ? "text-terminal-green" : "text-dim hover:text-muted"
            }`}
          >
            <Terminal size={12} className={activeTab === "TRACES" ? "text-terminal-green" : "text-dim"} />
            Live Traces
            {activeTab === "TRACES" && <span className="text-dim ml-1">({logs.length})</span>}
          </button>
          <div className="w-px h-3 bg-border" />
          <button
            onClick={() => setActiveTab("TELEMETRY")}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono transition-colors ${
              activeTab === "TELEMETRY" ? "text-info" : "text-dim hover:text-muted"
            }`}
          >
            <Activity size={12} className={activeTab === "TELEMETRY" ? "text-info" : "text-dim"} />
            Telemetry
          </button>
        </div>

        {activeTab === "TRACES" ? (
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 text-[10px] text-dim hover:text-error transition-colors font-mono uppercase"
          >
            <Trash2 size={10} />
            Clear
          </button>
        ) : (
          <button
            onClick={fetchTelemetry}
            className={`flex items-center gap-1 text-[10px] transition-colors font-mono uppercase ${
              isLoadingTelemetry ? "text-info opacity-50" : "text-dim hover:text-info"
            }`}
          >
            <RefreshCw size={10} className={isLoadingTelemetry ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "TRACES" ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-relaxed">
          {logs.length === 0 ? (
            <div className="flex items-center gap-2 text-dim text-xs">
              <span className="cursor-blink">▌</span>
              Awaiting background worker events...
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`log-entry flex flex-col gap-1 py-1.5 px-2 rounded border-b border-border/30 last:border-0 ${LEVEL_BG[log.level]}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-dim shrink-0 w-20">
                    {formatTime(log.timestamp)}
                  </span>
                  <span
                    className={`shrink-0 w-16 uppercase font-semibold ${LEVEL_COLORS[log.level]}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-dim shrink-0 font-bold">
                    [{log.source}]
                  </span>
                  {log.trace_id && (
                    <span className="text-[10px] bg-surface px-1 rounded border border-border/50 text-terminal-green ml-auto">
                      {log.trace_id}
                    </span>
                  )}
                </div>
                <span className="text-primary/90 whitespace-pre-wrap break-all ml-24">
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 bg-base">
          {telemetry ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Queue Depth</span>
                <span className="text-2xl font-mono text-amber">{telemetry.queue_depth} <span className="text-xs text-dim">jobs</span></span>
              </div>
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">P99 Latency</span>
                <span className="text-2xl font-mono text-terminal-green">{telemetry.p99_latency_ms} <span className="text-xs text-dim">ms</span></span>
              </div>
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Success Rate</span>
                <span className="text-2xl font-mono text-info">{telemetry.success_rate.toFixed(1)}<span className="text-xs text-dim">%</span></span>
              </div>
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Total Executions</span>
                <span className="text-2xl font-mono text-primary">{telemetry.total_logs} <span className="text-xs text-dim">traces</span></span>
              </div>
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">LLM Tokens Used</span>
                <span className="text-2xl font-mono text-primary">{telemetry.llm_tokens_used} <span className="text-xs text-dim">tokens</span></span>
              </div>
              <div className="border border-border rounded p-4 bg-surface flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-dim tracking-wider">Est. LLM Cost</span>
                <span className="text-2xl font-mono text-amber">${telemetry.estimated_llm_cost_usd.toFixed(4)} <span className="text-xs text-dim">USD</span></span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full gap-2 text-dim text-xs font-mono animate-pulse">
              <Activity size={14} className="animate-spin-slow" />
              Aggregating telemetry from PostgreSQL...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
