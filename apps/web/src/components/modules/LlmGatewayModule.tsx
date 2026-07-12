"use client";

import { useState } from "react";
import { Send, Loader2, Code, Bot, ChevronDown } from "lucide-react";
import { useLogStore } from "@/store/useLogStore";
import ReactMarkdown from "react-markdown";

interface QueueResponse {
  status: string;
  trace_id: string;
  message: string;
}

export function LlmGatewayModule() {
  const [prompt, setPrompt] = useState("Summarize the benefits of event-driven microservices architecture.");
  const [isRouting, setIsRouting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [result, setResult] = useState<QueueResponse | null>(null);
  const artifacts = useLogStore((s) => s.artifacts);
  const artifact = result?.trace_id ? artifacts[result.trace_id] : null;

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
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-amber bg-amber/10 px-1.5 py-0.5 rounded">
              EDU-FILTER
            </span>
            <h2 className="text-sm font-semibold text-primary group-hover:text-amber transition-colors">
              Edu-filter — YouTube AI Focus Agent
            </h2>
          </div>
          <ChevronDown size={14} className={`text-dim transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </div>
        
        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <p className="text-xs text-dim font-mono mb-3 leading-relaxed">
              Distraction reduction for YouTube using AI classification guided by custom keyword intent lists. Every visible video title is sent to an AI provider and classified as EDUCATIONAL or DISTRACTING. No instant local keyword filtering – keywords only steer AI behavior.
              <br /><br />
              <span className="text-primary font-semibold">System Context:</span> A headless reverse proxy routing architecture. It dynamically routes inference requests across multiple providers based on latency and rate-limit tracking, ensuring uninterrupted AI classification.
            </p>
          </div>
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
        <div className="flex items-center gap-2 text-[10px] text-dim font-mono pt-1">
          <span>Quick Example:</span>
          <button 
            onClick={() => setPrompt("Summarize the benefits of event-driven microservices architecture.")}
            className="text-muted hover:text-primary transition-colors underline decoration-border underline-offset-2"
          >
            &quot;Summarize the benefits of event-driven microservices architecture.&quot;
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
              <div className="flex items-center gap-1.5 self-start px-2 py-1 bg-amber/10 border border-amber/30 rounded text-[10px] font-mono text-amber">
                <Bot size={12} /> Provider: {artifact.provider_used}
              </div>
              <div className="text-xs text-primary leading-relaxed bg-base p-3 rounded border border-border/50 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{artifact.response_text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border border-border/30 rounded bg-base/30">
            <Loader2 size={24} className="animate-spin text-amber" />
            <span className="text-xs font-mono text-dim animate-pulse">Routing inference job...</span>
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
