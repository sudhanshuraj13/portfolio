"use client";

import Link from "next/link";
import { ExternalLink, Code, Play, Eye } from "lucide-react";

interface ProjectCardProps {
  name: string;
  status: string;
  statusType: "live" | "demo";
  description: string;
  highlights: string[];
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  consolePath?: string;
  demoPath?: string;
  installNote?: string;
}

export function ProjectCard({
  name,
  status,
  statusType,
  description,
  highlights,
  stack,
  githubUrl,
  liveUrl,
  consolePath,
  demoPath,
  installNote,
}: ProjectCardProps) {
  return (
    <div className="project-card border border-border rounded-lg bg-surface/50 overflow-hidden hover:border-terminal-green/20">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-border bg-surface-alt/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-primary">{name}</h3>
          <span
            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
              statusType === "live"
                ? "text-terminal-green border-terminal-green/30 bg-terminal-green/5 status-live"
                : "text-amber border-amber/30 bg-amber/5"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="text-sm text-dim leading-relaxed">{description}</p>
      </div>

      {/* Technical Highlights */}
      <div className="px-5 py-4 space-y-2.5">
        <span className="text-[10px] font-mono text-terminal-green uppercase tracking-widest">
          Key Technical Decisions
        </span>
        {highlights.map((h, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-terminal-green/50 shrink-0" />
            <p className="text-xs text-muted leading-relaxed">{h}</p>
          </div>
        ))}
      </div>

      {/* Stack Tags */}
      <div className="px-5 py-3 border-t border-border bg-base/30">
        <div className="flex flex-wrap gap-1.5">
          {stack.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-mono rounded border border-border text-dim bg-surface"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 border-t border-border flex flex-wrap items-center gap-2">
        {consolePath && (
          <Link
            href={consolePath}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/30 rounded text-terminal-green text-xs font-mono hover:bg-terminal-green/20 transition-colors"
          >
            <Play size={11} />
            Try live console
          </Link>
        )}

        {demoPath && (
          <Link
            href={demoPath}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/10 border border-amber/30 rounded text-amber text-xs font-mono hover:bg-amber/20 transition-colors"
          >
            <Eye size={11} />
            Watch demo
          </Link>
        )}

        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-info/10 border border-info/30 rounded text-info text-xs font-mono hover:bg-info/20 transition-colors"
          >
            <ExternalLink size={11} />
            Live demo
          </a>
        )}

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded text-muted text-xs font-mono hover:text-primary hover:border-terminal-green/30 transition-colors"
        >
          <Code size={11} />
          Source
        </a>

        {installNote && (
          <span className="text-[10px] font-mono text-dim ml-auto">
            {installNote}
          </span>
        )}
      </div>
    </div>
  );
}
