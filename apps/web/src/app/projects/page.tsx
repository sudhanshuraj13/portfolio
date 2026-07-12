"use client";

import { SiteNav } from "@/components/SiteNav";
import { ProjectCard } from "@/components/ProjectCard";
import { ChatBubble } from "@/components/ChatBubble";
import { FolderGit2 } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <FolderGit2 size={18} className="text-terminal-green" />
          <h1 className="text-xl font-semibold text-primary tracking-tight">
            Projects
          </h1>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-mono text-dim uppercase tracking-widest">
            4 repositories
          </span>
        </div>

        {/* Project Cards */}
        <div className="space-y-5">
          {/* ── SIH RAG Assistant ──────────────────────── */}
          <ProjectCard
            name="SIH RAG Assistant"
            status="Live demo available"
            statusType="live"
            description="Production RAG chatbot answering queries over the Smart India Hackathon (SIH) knowledge base, combining semantic vector search with grounded LLM generation to reduce hallucination."
            highlights={[
              "Hybrid retrieval in the API route: regex extraction resolves exact problem IDs (e.g., \"SIH25050\") directly from source JSON, while Vectra vector search with MiniLM-L6-v2 embeddings handles conceptual queries.",
              "Zero-cost ingestion pipeline: parses raw JSON, generates on-device embeddings via Xenova Transformers with no external API calls, indexed into a persistent local vector store.",
              "Tuned system prompts for Groq Llama 3.3 70B inference with real-time token streaming through Vercel AI SDK v6 for sub-second perceived latency.",
            ]}
            stack={[
              "Next.js 16",
              "TypeScript",
              "AI SDK v6",
              "Groq",
              "Vectra",
              "Xenova Transformers",
            ]}
            githubUrl="https://github.com/sudhanshuraj13/sih_chat"
            liveUrl="https://sihchatbot-kappa.vercel.app/"
            consolePath="/projects/sih-rag-assistant/console"
          />

          {/* ── A.R.G.U.S. ────────────────────────────── */}
          <ProjectCard
            name="A.R.G.U.S."
            status="Demo video — Chrome Web Store listing pending"
            statusType="demo"
            description="Voice-first AI browser automation agent. A LangGraph-orchestrated pipeline converts voice commands into typed automation actions, executed through a custom Playwright-style DOM runtime injected via content scripts to bypass Chrome extension sandbox limits."
            highlights={[
              'Cut voice-command response time ~3x by re-engineering the Web Speech API capture layer with single-utterance mode, a 1.2s interim-transcript stability timer, and a 3s silence timeout.',
              'Built a cascading element resolver (accessibility locators → role/text matching → AgentQL semantic resolution) plus a risk classifier and permission system that pauses purchases, deletions, and other high-risk actions for explicit user approval.',
            ]}
            stack={[
              "TypeScript",
              "React 18",
              "Plasmo (MV3)",
              "LangGraph",
              "AgentQL",
            ]}
            githubUrl="https://github.com/sudhanshuraj13/A.R.G.U.S"
            demoPath="/projects/argus"
            installNote="Load unpacked in Chrome"
          />

          {/* ── Edu-filter ─────────────────────────────── */}
          <ProjectCard
            name="Edu-filter"
            status="Demo video — Chrome Web Store listing pending"
            statusType="demo"
            description="Chrome extension that reads YouTube video titles via the DOM, classifies each as educational or distracting via an LLM, and shows/hides videos accordingly in real time."
            highlights={[
              "Multi-provider LLM support (OpenAI, Groq, Mistral) with user-supplied API key; key is stored locally client-side in the browser (not encrypted at rest).",
            ]}
            stack={[
              "Chrome Extension (Manifest V3)",
              "DOM Parsing",
              "Multi-Provider LLM Integration",
            ]}
            githubUrl="https://github.com/sudhanshuraj13/Edu-filter"
            demoPath="/projects/edu-filter"
            installNote="Load unpacked in Chrome"
          />

          {/* ── HR Workflow Designer ───────────────────── */}
          <ProjectCard
            name="HR Workflow Designer"
            status="Live demo available"
            statusType="live"
            description="Graph-based validation and simulation engine for organizational workflows — cycle detection, missing-link checks, and Start/End placement rules, running both client-side for instant feedback and server-side inside the simulation endpoint."
            highlights={[
              "Mock REST API layer (GET /api/automations, POST /api/simulate) plus a simulation engine that walks the workflow graph from the Start node, returning step-by-step execution logs.",
              "React Flow canvas with five typed, configurable node types (Start, Task, Approval, Automated Step, End) and JSON import/export for workflow persistence and replay.",
            ]}
            stack={[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "React Flow",
            ]}
            githubUrl="https://github.com/sudhanshuraj13/hr-workflow-designer"
            liveUrl="https://hr-workflow-designer-production.up.railway.app/"
            consolePath="/projects/hr-workflow-designer/console"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-dim">
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
            Sudhanshu Raj
          </div>
          <a
            href="mailto:sujalkashyap4803@gmail.com"
            className="text-xs font-mono text-dim hover:text-terminal-green transition-colors"
          >
            sujalkashyap4803@gmail.com
          </a>
        </div>
      </footer>

      <ChatBubble />
    </div>
  );
}
