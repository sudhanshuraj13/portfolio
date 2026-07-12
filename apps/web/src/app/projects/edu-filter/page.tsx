"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { ChatBubble } from "@/components/ChatBubble";
import { ArrowLeft, Code, Play, Monitor } from "lucide-react";

export default function EduFilterPage() {
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
          <span className="text-xs font-mono text-primary">Edu-filter</span>
          <span className="text-[9px] font-mono text-amber bg-amber/10 px-1.5 py-0.5 rounded">
            DEMO
          </span>
        </div>
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-3">Edu-filter</h1>
          <p className="text-sm text-dim leading-relaxed max-w-2xl">
            Chrome extension that reads YouTube video titles via the DOM,
            classifies each as educational or distracting via an LLM, and
            shows/hides videos accordingly in real time.
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
            {/* [NEED: Edu-filter demo video file] — replace this placeholder */}
            <div className="text-center space-y-3">
              <Monitor size={48} className="text-dim mx-auto" />
              <p className="text-sm font-mono text-dim">
                Demo video will be placed here
              </p>
              <p className="text-[10px] font-mono text-dim/60">
                [NEED: Edu-filter demo video or GIF]
              </p>
            </div>
          </div>
        </div>

        {/* Key Technical Decision */}
        <div className="border border-border rounded-lg bg-surface/50 p-5 mb-8">
          <h2 className="text-[10px] font-mono text-terminal-green uppercase tracking-widest mb-4">
            Key Technical Decision
          </h2>
          <div className="flex gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terminal-green/50 shrink-0" />
            <p className="text-sm text-muted leading-relaxed">
              Multi-provider LLM support (OpenAI, Groq, Mistral) with
              user-supplied API key; key is stored locally client-side in the
              browser (not encrypted at rest).
            </p>
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
                "Chrome Extension (Manifest V3)",
                "DOM Parsing",
                "Multi-Provider LLM Integration",
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
                https://github.com/sudhanshuraj13/Edu-filter
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
