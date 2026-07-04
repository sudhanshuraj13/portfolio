"use client";

import { useState } from "react";
import { Send, Loader2, Code } from "lucide-react";

interface QueueResponse {
  status: string;
  trace_id: string;
  message: string;
}

export function LlmGatewayModule() {
  const [prompt, setPrompt] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || isRouting) return;

    setIsRouting(true);
    setResult(null);

    try {
      const res = await fetch("/api/llm-gateway/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="border-b border-border px-4 py-3 bg-base/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-amber bg-amber/10 px-1.5 py-0.5 rounded">
            MICROSERVICE 02
          </span>
          <h2 className="text-sm font-semibold text-primary">
            Multi-Provider LLM Gateway Proxy
          </h2>
        </div>
        <p className="text-xs text-dim font-mono mb-3">
          Headless reverse proxy with automatic failover routing. Forces a 429
          Rate Limit on Groq and recovers via Gemini/Mistral.
        </p>

        {/* System Topology Block & GitHub Link */}
        <div className="bg-surface p-2 border border-border/50 rounded flex flex-col gap-2">
          <div className="text-[10px] text-dim font-mono">
            System Context: This microservice executes as a decoupled background worker via BullMQ.
          </div>
          <a href="https://github.com/sudhanshuraj13/Edu-filter" className="w-fit flex items-center gap-1.5 px-2 py-1 bg-surface-alt border border-border rounded text-[10px] font-mono text-muted hover:text-primary transition-colors">
            <Code size={12} />
            [ VIEW SOURCE ON GITHUB ]
          </a>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-border space-y-3">
        <label className="text-[10px] text-dim uppercase tracking-widest font-mono">
          Inference Prompt
        </label>
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isRouting}
            placeholder="Enter a prompt to route through the LLM gateway..."
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-xs font-mono text-primary placeholder-dim focus:outline-none focus:border-amber/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={isRouting || !prompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber/10 border border-amber/30 rounded text-amber text-xs font-mono hover:bg-amber/20 transition-colors disabled:opacity-30"
          >
            {isRouting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
            Dispatch Job
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
              Watch the Live Traces panel below to monitor the failover sequence in real-time.
            </p>
          </div>
        )}

        {!isRouting && !result && (
          <div className="text-xs text-dim font-mono text-center py-8">
            Enter a prompt and dispatch the job to the worker queue.
          </div>
        )}
      </div>
    </div>
  );
}
