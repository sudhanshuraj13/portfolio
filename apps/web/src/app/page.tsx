"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { ChatBubble } from "@/components/ChatBubble";
import {
  ArrowRight,
  Download,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Briefcase,
  Terminal,
} from "lucide-react";

/* ───────── Data ───────── */

const SKILLS = {
  "AI / Agentic Systems": [
    "RAG",
    "LangChain",
    "LangGraph",
    "Multi-Agent Orchestration",
    "Hybrid Retrieval (Regex + Semantic Search)",
    "Prompt Engineering",
    "Multi-Provider LLM Routing",
    "Vector Databases (Vectra)",
    "On-Device Embeddings (Xenova Transformers, MiniLM-L6-v2)",
    "Vercel AI SDK",
  ],
  Languages: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL", "C/C++"],
  "Backend & APIs": [
    "Node.js",
    "Next.js Route Handlers",
    "Express.js",
    "REST API Design",
    "Webhook Integration",
    "Data Ingestion Pipelines",
  ],
  Databases: ["Firebase", "Supabase", "PostgreSQL", "Vector Stores (Vectra)"],
  "DevOps & Infra": [
    "GitHub Actions CI/CD",
    "Vercel",
    "Git",
    "AWS",
    "Google Cloud",
  ],
};

const EXPERIENCE = {
  company: "Clinixs",
  role: "Backend & AI Engineering Intern",
  type: "Healthcare SaaS Startup",
  period: "Jan 2025 – Present",
  location: "Remote",
  stack: [
    "Node.js",
    "Next.js Route Handlers",
    "Express.js",
    "Firebase",
    "Supabase",
    "GitHub Actions CI/CD",
    "Vercel",
    "WhatsApp Business Cloud API",
  ],
  bullets: [
    "Built an LLM-driven AI agent for patient-facing clinic workflows, routing natural language queries from the WhatsApp Business Cloud API through an LLM for automated response generation.",
    "Designed a Firebase/Supabase data layer for patient and clinic records with a PII-stripping stage upstream of every LLM API call, meeting India's Digital Personal Data Protection (DPDP) Act compliance requirements.",
    "Set up GitHub Actions CI/CD — automated lint and type-check gating on every pull request, with Vercel auto-deploy on merge — for Next.js backend services built for reliability under production data-compliance constraints.",
  ],
};

const FEATURED_PROJECTS = [
  {
    name: "SIH RAG Assistant",
    slug: "sih-rag-assistant",
    description:
      "Production RAG chatbot combining semantic vector search with grounded LLM generation over the Smart India Hackathon knowledge base.",
    stack: ["Next.js 16", "TypeScript", "AI SDK v6", "Groq", "Vectra"],
    status: "Live",
    href: "/projects/sih-rag-assistant/console",
  },
  {
    name: "A.R.G.U.S.",
    slug: "argus",
    description:
      "Voice-first AI browser automation agent. LangGraph-orchestrated pipeline converts voice commands into typed automation actions.",
    stack: ["TypeScript", "React 18", "Plasmo (MV3)", "LangGraph"],
    status: "Demo",
    href: "/projects/argus",
  },
  {
    name: "HR Workflow Designer",
    slug: "hr-workflow-designer",
    description:
      "Graph-based validation and simulation engine for organizational workflows with cycle detection and step-by-step execution logs.",
    stack: ["Next.js 15", "React 19", "TypeScript", "React Flow"],
    status: "Live",
    href: "/projects/hr-workflow-designer/console",
  },
];

/* ───────── Component ───────── */

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid opacity-60" />
          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terminal-green/5 rounded-full blur-3xl hero-glow" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              {/* Profile Photo */}
              <div className="shrink-0 fade-up">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl border-2 border-border bg-surface flex items-center justify-center overflow-hidden relative">
                  {/* [NEED: profile photo] — replace this placeholder with an <Image> tag pointing to your photo */}
                  <div className="w-full h-full bg-gradient-to-br from-terminal-green/20 to-info/20 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold gradient-text">SR</span>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-terminal-green shadow-[0_0_8px_rgba(34,197,94,0.6)] status-live" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 fade-up fade-up-delay-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-terminal-green shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-mono text-terminal-green uppercase tracking-widest">
                    Available for opportunities
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3 tracking-tight">
                  Sudhanshu Raj
                </h1>

                <p className="text-base sm:text-lg text-muted font-mono mb-4">
                  AI Engineer — RAG systems, multi-agent orchestration, backend infrastructure
                </p>

                <p className="text-sm text-dim leading-relaxed max-w-2xl mb-6">
                  AI and Backend Engineer specializing in RAG pipelines, LangGraph multi-agent orchestration, and production backend systems in TypeScript, Node.js, and Python. Currently Backend & AI Engineering Intern at Clinixs (healthcare SaaS), building an LLM-driven patient engagement agent on the WhatsApp Business Cloud API with production CI/CD ownership.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2.5 bg-terminal-green/10 border border-terminal-green/30 rounded-lg text-terminal-green text-sm font-mono hover:bg-terminal-green/20 transition-colors"
                  >
                    <Download size={14} />
                    {/* [NEED: resume PDF link] */}
                    Download Resume
                  </a>
                  <a
                    href="mailto:sujalkashyap4803@gmail.com"
                    className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-primary text-sm font-mono hover:border-terminal-green/30 hover:text-terminal-green transition-colors"
                  >
                    <Mail size={14} />
                    Contact
                  </a>
                  <a
                    href="https://github.com/sudhanshuraj13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-muted text-sm font-mono hover:border-terminal-green/30 hover:text-primary transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sudhanshu-raj-21a638250"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-muted text-sm font-mono hover:border-terminal-green/30 hover:text-primary transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Divider ───────────────────────────── */}
        <div className="section-divider" />

        {/* ── Experience ──────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 fade-up fade-up-delay-2">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase size={16} className="text-terminal-green" />
            <h2 className="text-lg font-semibold text-primary tracking-tight">
              Experience
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="border border-border rounded-lg bg-surface/50 overflow-hidden">
            {/* Experience Header */}
            <div className="px-5 py-4 border-b border-border bg-surface-alt/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    {EXPERIENCE.company}
                  </h3>
                  <p className="text-sm text-muted">
                    {EXPERIENCE.role}{" "}
                    <span className="text-dim">({EXPERIENCE.type})</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-dim">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {EXPERIENCE.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {EXPERIENCE.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Bullets */}
            <div className="px-5 py-4 space-y-3">
              {EXPERIENCE.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terminal-green/60 shrink-0" />
                  <p className="text-sm text-muted leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>

            {/* Stack Tags */}
            <div className="px-5 py-3 border-t border-border bg-base/30">
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE.stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono rounded border border-border text-dim bg-surface"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Divider ───────────────────────────── */}
        <div className="section-divider" />

        {/* ── Skills ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 fade-up fade-up-delay-3">
          <div className="flex items-center gap-3 mb-8">
            <Terminal size={16} className="text-terminal-green" />
            <h2 className="text-lg font-semibold text-primary tracking-tight">
              Skills
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(SKILLS).map(([category, skills]) => (
              <div
                key={category}
                className="border border-border rounded-lg bg-surface/50 p-4"
              >
                <h3 className="text-[10px] font-mono text-terminal-green uppercase tracking-widest mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-pill px-2.5 py-1 text-xs font-mono rounded border border-border text-muted bg-base hover:border-terminal-green/30 hover:text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section Divider ───────────────────────────── */}
        <div className="section-divider" />

        {/* ── Featured Projects ────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 fade-up fade-up-delay-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FolderGit2Icon />
              <h2 className="text-lg font-semibold text-primary tracking-tight">
                Featured Projects
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-1.5 text-sm font-mono text-terminal-green hover:text-terminal-green-dim transition-colors"
            >
              View all projects
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={project.href}
                className="project-card group border border-border rounded-lg bg-surface/50 p-5 flex flex-col hover:border-terminal-green/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-primary group-hover:text-terminal-green transition-colors">
                    {project.name}
                  </h3>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      project.status === "Live"
                        ? "text-terminal-green border-terminal-green/30 bg-terminal-green/5"
                        : "text-amber border-amber/30 bg-amber/5"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-xs text-dim leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-mono rounded border border-border text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs font-mono text-terminal-green opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={11} />
                  {project.status === "Live" ? "Open console" : "View details"}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────── */}
        <footer className="border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-dim">
              <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
              Designed & engineered by Sudhanshu Raj
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-dim">
              <a
                href="mailto:sujalkashyap4803@gmail.com"
                className="hover:text-terminal-green transition-colors"
              >
                sujalkashyap4803@gmail.com
              </a>
              <a
                href="tel:+919155448358"
                className="hover:text-terminal-green transition-colors"
              >
                +91 91554 48358
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Chat Bubble */}
      <ChatBubble />
    </div>
  );
}

function FolderGit2Icon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-terminal-green"
    >
      <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5" />
      <circle cx="13" cy="12" r="2" />
      <path d="M18 19c-2.8 0-5-2.2-5-5v8" />
      <circle cx="20" cy="19" r="2" />
    </svg>
  );
}
