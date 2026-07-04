"use client";

import { useState } from "react";
import { Search, Loader2, Code, Database } from "lucide-react";
import { useLogStore } from "@/store/useLogStore";

interface QueueResponse {
  status: string;
  trace_id: string;
  message: string;
}

export function RagSandboxModule() {
  const [query, setQuery] = useState("Smart early warning system for water-borne diseases");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);
  const artifacts = useLogStore((s) => s.artifacts);
  const artifact = result?.trace_id ? artifacts[result.trace_id] : null;

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setResult(null);

    try {
      const res = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="border-b border-border px-4 py-3 bg-base/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-info bg-info/10 px-1.5 py-0.5 rounded">
            MICROSERVICE 03
          </span>
          <h2 className="text-sm font-semibold text-primary">
            Hybrid RAG Pipeline
          </h2>
        </div>
        <p className="text-xs text-dim font-mono mb-3">
          Local hybrid search architecture. Combines fast regex exact matching with
          semantic algorithmic scoring for robust retrieval without external API costs.
        </p>

        {/* System Context Block */}
        <div className="bg-surface p-3 border border-border/50 rounded flex flex-col gap-2 mt-2">
          <div className="text-xs font-bold text-primary uppercase tracking-wide">
            Hybrid Search Pipeline (SIH System)
          </div>
          <div className="text-[10px] text-dim font-mono leading-relaxed">
            A hybrid retrieval strategy combining regex-based exact problem-ID matching with semantic vector search to deliver highly precise, context-aware answers without external API costs.
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-border space-y-3">
        <label className="text-[10px] text-dim uppercase tracking-widest font-mono">
          Search Query
        </label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={isSearching}
            placeholder="Search problem statements..."
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-xs font-mono text-primary placeholder-dim focus:outline-none focus:border-info/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-info/10 border border-info/30 rounded text-info text-xs font-mono hover:bg-info/20 transition-colors disabled:opacity-30"
          >
            {isSearching ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Search size={12} />
            )}
            Dispatch Job
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-dim font-mono pt-1">
          <span>Quick Example:</span>
          <button 
            onClick={() => setQuery("Smart early warning system for water-borne diseases")}
            className="text-muted hover:text-primary transition-colors underline decoration-border underline-offset-2"
          >
            &quot;Smart early warning system for water-borne diseases&quot;
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
            <div className="p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-info mb-1">
                <Database size={14} /> Retrieved {artifact.results_found} Matches
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                {artifact.results?.map((doc: any, i: number) => (
                  <div key={i} className="bg-base p-3 rounded border border-border/50 hover:border-info/30 transition-colors flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-primary">{doc.title}</div>
                      <div className="text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border text-dim whitespace-nowrap">
                        {doc.id}
                      </div>
                    </div>
                    <div className="text-[10px] text-dim leading-relaxed line-clamp-3">
                      {doc.description || doc.full_description}
                    </div>
                    <div className="text-[9px] text-info/70 font-mono mt-1">
                      Matched via: {doc.matchType} ({doc.score.toFixed(2)})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border border-border/30 rounded bg-base/30">
            <Loader2 size={24} className="animate-spin text-info" />
            <span className="text-xs font-mono text-dim animate-pulse">Running hybrid RAG pipeline...</span>
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
