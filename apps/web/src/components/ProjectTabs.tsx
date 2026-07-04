"use client";

import { Bot, Route, Search, GitFork } from "lucide-react";
import { useLogStore, type ModuleId } from "@/store/useLogStore";

const MODULES: { id: ModuleId; label: string; shortLabel: string; icon: typeof Bot }[] = [
  {
    id: "argus",
    label: "A.R.G.U.S. Engine",
    shortLabel: "MICROSERVICE 01",
    icon: Bot,
  },
  {
    id: "llm-gateway",
    label: "LLM Gateway Proxy",
    shortLabel: "MICROSERVICE 02",
    icon: Route,
  },
  {
    id: "rag-sandbox",
    label: "RAG Eval Sandbox",
    shortLabel: "MICROSERVICE 03",
    icon: Search,
  },
  {
    id: "graph-validator",
    label: "Graph Validator",
    shortLabel: "MICROSERVICE 04",
    icon: GitFork,
  },
];

export function ProjectTabs() {
  const activeModule = useLogStore((s) => s.activeModule);
  const setActiveModule = useLogStore((s) => s.setActiveModule);

  return (
    <aside className="w-52 min-w-52 border-r border-border bg-surface-alt flex flex-col select-none">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-[10px] text-dim uppercase tracking-widest font-mono">
          SYSTEM MICROSERVICES
        </span>
      </div>

      <nav className="flex-1 py-1">
        {MODULES.map((mod) => {
          const isActive = activeModule === mod.id;
          const Icon = mod.icon;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 group ${
                isActive
                  ? "bg-terminal-green/8 border-l-2 border-terminal-green text-primary"
                  : "border-l-2 border-transparent text-muted hover:text-primary hover:bg-surface"
              }`}
            >
              <Icon
                size={14}
                className={
                  isActive
                    ? "text-terminal-green"
                    : "text-dim group-hover:text-muted"
                }
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-dim uppercase tracking-wider">
                  {mod.shortLabel}
                </span>
                <span className="text-xs truncate">{mod.label}</span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-terminal-green shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer metadata */}
      <div className="border-t border-border px-3 py-2 space-y-1">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-dim">Runtime</span>
          <span className="text-muted">Node 22.x</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-dim">Protocol</span>
          <span className="text-muted">Fastify/WS</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-dim">Region</span>
          <span className="text-muted">asia-south1</span>
        </div>
      </div>
    </aside>
  );
}
