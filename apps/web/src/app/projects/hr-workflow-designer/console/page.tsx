"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SystemLogPanel } from "@/components/SystemLogPanel";
import { GraphValidatorModule } from "@/components/modules/GraphValidatorModule";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ArrowLeft, ExternalLink, Code } from "lucide-react";

export default function HrWorkflowConsolePage() {
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
          <span className="text-xs font-mono text-primary">
            HR Workflow Designer
          </span>
          <span className="text-[9px] font-mono text-terminal-green bg-terminal-green/10 px-1.5 py-0.5 rounded">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://hr-workflow-designer-production.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-info hover:text-info/80 transition-colors"
          >
            <ExternalLink size={10} />
            Live demo
          </a>
          <a
            href="https://github.com/sudhanshuraj13/hr-workflow-designer"
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
          Interactive console — test the DFS graph validation engine. Toggle between a valid DAG and a broken cyclic graph to see cycle detection in action.
        </p>
      </div>

      {/* Module workspace */}
      <main className="flex-1 overflow-hidden bg-surface flex flex-col">
        <GraphValidatorModule />
      </main>

      {/* Log Panel */}
      <SystemLogPanel />
    </div>
  );
}
