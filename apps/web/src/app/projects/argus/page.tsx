"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { ChatBubble } from "@/components/ChatBubble";
import { ArrowLeft, Code, Download, Play, Monitor } from "lucide-react";

export default function ArgusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Breadcrumb */}
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
          <span className="text-xs font-mono text-primary">A.R.G.U.S.</span>
          <span className="text-[9px] font-mono text-amber bg-amber/10 px-1.5 py-0.5 rounded">
            DEMO
          </span>
        </div>
        <a
          href="https://github.com/sudhanshuraj13/A.R.G.U.S"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-dim hover:text-primary transition-colors"
        >
          <Code size={10} />
          Source
        </a>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-3">A.R.G.U.S.</h1>
          <p className="text-sm text-dim leading-relaxed max-w-2xl">
            Voice-first AI browser automation agent. A LangGraph-orchestrated
            pipeline converts voice commands into typed automation actions,
            executed through a custom Playwright-style DOM runtime injected via
            content scripts to bypass Chrome extension sandbox limits.
          </p>
        </div>

        {/* Demo Video Placeholder */}
        <div className="border border-border rounded-lg bg-surface overflow-hidden mb-8">
          <div className="px-4 py-2 border-b border-border bg-surface-alt flex items-center gap-2">
            <Play size={12} className="text-terminal-green" />
            <span className="text-[10px] font-mono text-dim uppercase tracking-widest">
              Demo Recording
            </span>
          </div>
          <div className="aspect-video bg-base flex items-center justify-center">
            {/* [NEED: A.R.G.U.S. demo video file] — replace this placeholder */}
            <div className="text-center space-y-3">
              <Monitor size={48} className="text-dim mx-auto" />
              <p className="text-sm font-mono text-dim">
                Demo video will be placed here
              </p>
              <p className="text-[10px] font-mono text-dim/60">
                [NEED: A.R.G.U.S. demo video or GIF]
              </p>
            </div>
          </div>
        </div>

        {/* Key Technical Decisions */}
        <div className="border border-border rounded-lg bg-surface/50 p-5 mb-8">
          <h2 className="text-[10px] font-mono text-terminal-green uppercase tracking-widest mb-4">
            Key Technical Decisions
          </h2>
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terminal-green/50 shrink-0" />
              <p className="text-sm text-muted leading-relaxed">
                Cut voice-command response time ~3x by re-engineering the Web
                Speech API capture layer with single-utterance mode, a 1.2s
                interim-transcript stability timer, and a 3s silence timeout.
              </p>
            </div>
            <div className="flex gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terminal-green/50 shrink-0" />
              <p className="text-sm text-muted leading-relaxed">
                Built a cascading element resolver (accessibility locators →
                role/text matching → AgentQL semantic resolution) plus a risk
                classifier and permission system that pauses purchases,
                deletions, and other high-risk actions for explicit user
                approval.
              </p>
            </div>
          </div>
        </div>

        {/* Stack & Install */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 border border-border rounded-lg bg-surface/50 p-4">
            <h3 className="text-[10px] font-mono text-dim uppercase tracking-widest mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                "TypeScript",
                "React 18",
                "Plasmo (MV3)",
                "LangGraph",
                "AgentQL",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono rounded border border-border text-muted bg-base"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 border border-border rounded-lg bg-surface/50 p-4">
            <h3 className="text-[10px] font-mono text-dim uppercase tracking-widest mb-3">
              Install
            </h3>
            <div className="bg-base rounded p-3 border border-border">
              <code className="text-xs font-mono text-terminal-green">
                <span className="text-dim">$</span> git clone
                https://github.com/sudhanshuraj13/A.R.G.U.S
              </code>
              <br />
              <code className="text-xs font-mono text-muted mt-1 block">
                <span className="text-dim">#</span> Load unpacked in
                chrome://extensions
              </code>
            </div>
          </div>
        </div>
      </main>

      <ChatBubble />
    </div>
  );
}
