"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SystemLogPanel } from "@/components/SystemLogPanel";
import { LlmGatewayModule } from "@/components/modules/LlmGatewayModule";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ArrowLeft, Code } from "lucide-react";

export default function EduFilterConsolePage() {
  useWebSocket();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <SiteNav />

      {/* Project context bar */}
      <div className="border-b border-border bg-surface-alt px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-xs font-mono text-dim hover:text-terminal-green transition-colors"
          >
            <ArrowLeft size={12} />
            Projects
          </Link>
          <span className="text-dim text-xs">/</span>
          <span className="text-xs font-mono text-primary">Edu-filter</span>
          <span className="text-[9px] font-mono text-amber bg-amber/10 px-1.5 py-0.5 rounded">
            DEMO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/sudhanshuraj13/Edu-filter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-dim hover:text-primary transition-colors"
          >
            <Code size={10} />
            Source
          </a>
        </div>
      </div>

      {/* Console hint */}
      <div className="px-4 sm:px-6 py-1.5 border-b border-border bg-base/50">
        <p className="text-[10px] font-mono text-dim">
          Interactive console — test the LLM proxy gateway that classifies video titles for the Chrome extension backend.
        </p>
      </div>

      {/* Module workspace */}
      <main className="flex-1 overflow-hidden bg-surface flex flex-col">
        <LlmGatewayModule />
      </main>

      {/* Log Panel */}
      <SystemLogPanel />
    </div>
  );
}
