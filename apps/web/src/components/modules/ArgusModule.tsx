"use client";

import { useState } from "react";
import { Play, Loader2, Code, AlertTriangle, ChevronDown } from "lucide-react";
import { useLogStore } from "@/store/useLogStore";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);
  const artifacts = useLogStore((s) => s.artifacts);
  const addArtifact = useLogStore((s) => s.addArtifact);
  const artifact = result?.trace_id ? artifacts[result.trace_id] : null;

  const handleApprove = async () => {
    if (!result?.trace_id) return;
    setIsExecuting(true);
    const currentTraceId = result.trace_id;
    setResult(null); 
    addArtifact(currentTraceId, null); // Clear the old artifact

    try {
      const res = await fetch("/api/argus/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, trace_id: currentTraceId }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

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
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-terminal-green bg-terminal-green/10 px-1.5 py-0.5 rounded">
              A.R.G.U.S.
            </span>
            <h2 className="text-sm font-semibold text-primary group-hover:text-terminal-green transition-colors">
              A.R.G.U.S. Agentic Web Automation Engine
            </h2>
          </div>
          <ChevronDown size={14} className={`text-dim transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
        
        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <p className="text-xs text-dim font-mono mb-3 leading-relaxed">
              Autonomous stateful browser assistant powered by LangGraph. Simulates
              intent extraction, web search, and action token generation.
              <br /><br />
              <span className="text-primary font-semibold">System Context:</span> The core execution engine powering A.R.G.U.S. It utilizes LangGraph state loops to execute unstructured browsing tasks, featuring a RiskClassifier protocol that intercepts high-risk commands for manual approval.
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-border space-y-3">
        <label className="text-[10px] text-dim uppercase tracking-widest font-mono">
          Voice Command Simulation
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
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
        {artifact ? (
          <div className="border border-border bg-surface-alt rounded flex flex-col">
            <div className="px-3 py-1.5 border-b border-border bg-surface flex justify-between items-center">
              <span className="text-[10px] font-mono text-dim uppercase tracking-wider">Execution Artifact</span>
              <span className="text-[10px] font-mono text-terminal-green uppercase">Job Complete</span>
            </div>
            <div className="p-3">
              {artifact.status === "APPROVAL_REQUIRED" ? (
                <div className="border border-amber bg-amber/10 text-amber p-3 rounded font-mono text-xs flex flex-col gap-3">
                  <div className="font-bold flex items-center gap-2">
                    <AlertTriangle size={14} /> Execution Paused: Manual Approval Required
                  </div>
                  <div className="opacity-80">Reason: {artifact.reason}</div>
                  <div className="opacity-80">Risk Level: {artifact.risk_level}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={handleApprove}
                      disabled={isExecuting}
                      className="px-4 py-1.5 bg-terminal-green/20 border border-terminal-green/50 text-terminal-green rounded hover:bg-terminal-green/30 transition-colors disabled:opacity-50"
                    >
                      {isExecuting ? "Processing..." : "Approve Transaction"}
                    </button>
                    <button 
                      disabled={isExecuting}
                      onClick={() => setResult(null)}
                      className="px-4 py-1.5 bg-error/20 border border-error/50 text-error rounded hover:bg-error/30 transition-colors disabled:opacity-50"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ) : artifact.status === "BOOKED" ? (
                <div className="border border-info bg-info/10 text-primary p-3 rounded font-mono text-xs flex flex-col gap-2">
                  <div className="font-bold text-info flex items-center gap-2 mb-2">
                    ✓ Transaction Authorized & Completed
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-dim">Item:</span>
                    <span>{artifact.item}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-dim">Payment Method:</span>
                    <span>{artifact.payment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Delivery ETA:</span>
                    <span className="text-terminal-green">{artifact.delivery_eta}</span>
                  </div>
                </div>
              ) : (
                <pre className="text-[10px] font-mono text-primary whitespace-pre-wrap bg-base p-2 rounded border border-border/50 overflow-x-auto">
                  {JSON.stringify(artifact, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border border-border/30 rounded bg-base/30">
            <Loader2 size={24} className="animate-spin text-terminal-green" />
            <span className="text-xs font-mono text-dim animate-pulse">Executing background job...</span>
          </div>
        ) : (
          <div className="text-xs text-dim font-mono text-center py-8">
            Awaiting Execution...
          </div>
        )}
      </div>
    </div>
  );
}
