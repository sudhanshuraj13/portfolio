"use client";

import { useState, useEffect } from "react";
import { Play, ToggleLeft, ToggleRight, Loader2, Code, ShieldCheck, ShieldAlert, ChevronDown } from "lucide-react";
import { useLogStore } from "@/store/useLogStore";

const DEFAULT_VALID_DAG = JSON.stringify(
  {
    nodes: ["A", "B", "C", "D"],
    edges: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "D" },
    ],
  },
  null,
  2
);

const DEFAULT_BROKEN_DAG = JSON.stringify(
  {
    nodes: ["A", "B", "C", "D"],
    edges: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "D" },
      { from: "D", to: "B" }, // CYCLE!
    ],
  },
  null,
  2
);

interface QueueResponse {
  status: string;
  trace_id: string;
  message: string;
}

export function GraphValidatorModule() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_VALID_DAG);
  const [isBroken, setIsBroken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const artifacts = useLogStore((s) => s.artifacts);
  const artifact = result?.trace_id ? artifacts[result.trace_id] : null;

  // Toggle between valid and broken graph
  useEffect(() => {
    setJsonInput(isBroken ? DEFAULT_BROKEN_DAG : DEFAULT_VALID_DAG);
    setJsonError(null);
  }, [isBroken]);

  const handleValidate = async () => {
    if (isValidating) return;

    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError(null);
      setIsValidating(true);
      setResult(null);

      const res = await fetch("/api/graph/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph: parsed }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setJsonError("Invalid JSON syntax");
      setResult(null);
    } finally {
      setIsValidating(false);
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
            <span className="text-[10px] font-mono text-error bg-error/10 px-1.5 py-0.5 rounded">
              HR WORKFLOW DESIGNER
            </span>
            <h2 className="text-sm font-semibold text-primary group-hover:text-error transition-colors">
              HR Workflow Designer
            </h2>
          </div>
          <ChevronDown size={14} className={`text-dim transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
        
        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <p className="text-xs text-dim font-mono mb-3 leading-relaxed">
              A React Flow canvas builder that lets HR admins place steps, connect them, configure each step, and run the workflow through a mock simulation. Features client-side validation for missing links, invalid Start/End placement, and cycles.
              <br /><br />
              <span className="text-primary font-semibold">System Context:</span> A deterministic backend engine that ingests complex adjacency lists and executes Depth-First Search (DFS) algorithms to detect infinite data cycles and invalid state placements.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBroken(!isBroken)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
              isBroken
                ? "border-error/30 text-error bg-error/5 hover:bg-error/10"
                : "border-terminal-green/30 text-terminal-green bg-terminal-green/5 hover:bg-terminal-green/10"
            }`}
          >
            {isBroken ? (
              <ToggleRight size={14} />
            ) : (
              <ToggleLeft size={14} />
            )}
            {isBroken ? "Broken Graph (Cyclic)" : "Valid DAG"}
          </button>
        </div>

        <button
          onClick={handleValidate}
          disabled={isValidating}
          className="flex items-center gap-1.5 px-4 py-2 bg-terminal-green/10 border border-terminal-green/30 rounded text-terminal-green text-xs font-mono hover:bg-terminal-green/20 transition-colors disabled:opacity-30"
        >
          {isValidating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={12} />
          )}
          Dispatch Job
        </button>
      </div>

      {/* Content: JSON Editor + Results side by side */}
      <div className="flex-1 overflow-hidden flex">
        {/* JSON Editor */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="px-3 py-1.5 border-b border-border bg-surface-alt">
            <span className="text-[10px] font-mono text-dim uppercase tracking-wider">
              Adjacency List (JSON)
            </span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setJsonError(null);
            }}
            spellCheck={false}
            className="flex-1 bg-base p-3 text-xs font-mono text-primary resize-none focus:outline-none"
          />
          {jsonError && (
            <div className="px-3 py-1.5 border-t border-error/30 bg-error/5 text-[10px] font-mono text-error">
              {jsonError}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col">
          <div className="px-3 py-1.5 border-b border-border bg-surface-alt">
            <span className="text-[10px] font-mono text-dim uppercase tracking-wider">
              Validation Result
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
            {artifact ? (
              <div className="border border-border bg-surface-alt rounded flex flex-col mt-4">
                <div className="px-3 py-1.5 border-b border-border bg-surface flex justify-between items-center">
                  <span className="text-[10px] font-mono text-dim uppercase tracking-wider">Execution Artifact</span>
                  <span className="text-[10px] font-mono text-terminal-green uppercase">Job Complete</span>
                </div>
                <div className="p-3">
                  <div className={`border p-3 rounded font-mono text-xs flex flex-col gap-2 ${
                    artifact.valid 
                      ? "border-terminal-green/30 bg-terminal-green/5 text-terminal-green" 
                      : "border-error/30 bg-error/5 text-error"
                  }`}>
                    <div className="font-bold flex items-center gap-2 mb-2">
                      {artifact.valid ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} 
                      Validation Result: {artifact.valid ? "PASSED" : "FAILED"}
                    </div>
                    <pre className="text-[10px] font-mono text-primary whitespace-pre-wrap bg-base p-2 rounded border border-border/50">
                      {JSON.stringify(artifact, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 border border-border/30 rounded bg-base/30 mt-4">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="text-xs font-mono text-dim animate-pulse">Running DFS graph validation...</span>
              </div>
            ) : (
              <div className="text-xs text-dim font-mono text-center py-8">
                Click Dispatch Job to run the DFS traversal algorithm on the queue.
                <br />
                Toggle &ldquo;Broken Graph&rdquo; to test cycle detection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
