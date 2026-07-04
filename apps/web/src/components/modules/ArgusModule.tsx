"use client";

import { useState } from "react";
import { Play, Loader2, Code } from "lucide-react";

interface QueueResponse {
  status: string;
  trace_id: string;
  message: string;
}

export function ArgusModule() {
  const [command, setCommand] = useState(
    "Check the price of a blue shirt on Amazon and buy it"
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);

  const handleExecute = async () => {
    if (!command.trim() || isExecuting) return;

    setIsExecuting(true);
    setResult(null);

    try {
      const res = await fetch("/api/argus/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="border-b border-border px-4 py-3 bg-base/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-terminal-green bg-terminal-green/10 px-1.5 py-0.5 rounded">
            MICROSERVICE 01
          </span>
          <h2 className="text-sm font-semibold text-primary">
            A.R.G.U.S. Agentic Web Automation Engine
          </h2>
        </div>
        <p className="text-xs text-dim font-mono mb-3">
          Autonomous stateful browser assistant powered by LangGraph. Simulates
          intent extraction, web search, and action token generation.
        </p>

        {/* System Topology Block & GitHub Link */}
        <div className="bg-surface p-2 border border-border/50 rounded flex flex-col gap-2">
          <div className="text-[10px] text-dim font-mono">
            System Context: This microservice executes as a decoupled background worker via BullMQ.
          </div>
          <a href="https://github.com/sudhanshuraj13/A.R.G.U.S" className="w-fit flex items-center gap-1.5 px-2 py-1 bg-surface-alt border border-border rounded text-[10px] font-mono text-muted hover:text-primary transition-colors">
            <Code size={12} />
            [ VIEW SOURCE ON GITHUB ]
          </a>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-border space-y-3">
        <label className="text-[10px] text-dim uppercase tracking-widest font-mono">
          Voice Command Simulation
        </label>
        <div className="flex gap-2">
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExecute()}
            disabled={isExecuting}
            placeholder='e.g. "Find a laptop on Amazon under $500"'
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-xs font-mono text-primary placeholder-dim focus:outline-none focus:border-terminal-green/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleExecute}
            disabled={isExecuting || !command.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-terminal-green/10 border border-terminal-green/30 rounded text-terminal-green text-xs font-mono hover:bg-terminal-green/20 transition-colors disabled:opacity-30"
          >
            {isExecuting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Play size={12} />
            )}
            Dispatch Job
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-dim font-mono pt-1">
          <span>Quick Example:</span>
          <button 
            onClick={() => setCommand("Check the price of a blue shirt on Amazon and buy it")}
            className="text-muted hover:text-primary transition-colors underline decoration-border underline-offset-2"
          >
            &quot;Check the price of a blue shirt on Amazon and buy it&quot;
          </button>
        </div>
      </div>

      {/* Result Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {result && (
          <div className="border border-terminal-green/30 bg-terminal-green/5 rounded p-3">
            <div className="text-xs font-semibold text-terminal-green uppercase tracking-wider mb-2">
              ✓ {result.message}
            </div>
            <div className="text-xs font-mono text-primary flex gap-2 items-center">
              <span className="text-dim">Trace ID:</span>
              <span className="bg-surface px-1.5 py-0.5 rounded border border-border/50 text-terminal-green font-bold">
                {result.trace_id}
              </span>
            </div>
            <p className="text-[10px] text-dim font-mono mt-3">
              This task is now executing asynchronously in the BullMQ worker pool.
              Watch the Live Traces panel below to monitor execution steps in real-time.
            </p>
          </div>
        )}

        {!isExecuting && !result && (
          <div className="text-xs text-dim font-mono text-center py-8">
            Enter a voice command and dispatch the job to the worker queue.
          </div>
        )}
      </div>
    </div>
  );
}
