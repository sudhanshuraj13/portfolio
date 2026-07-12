# Sudhanshu Raj — AI & Backend Engineer Portfolio

Personal portfolio website showcasing AI engineering and backend development projects.

Built with a **terminal/system-monitor aesthetic** — dark theme, monospace accents, live WebSocket trace panels — to reflect the kind of systems I build.

## Projects

### SIH RAG Assistant
A RAG chatbot for the Smart India Hackathon knowledge base. Hybrid retrieval combines regex-based exact problem-ID matching with Vectra vector search (MiniLM-L6-v2 embeddings). Groq Llama 3.3 70B inference with real-time token streaming via Vercel AI SDK v6.

**Stack:** Next.js 16, TypeScript, AI SDK v6, Groq, Vectra, Xenova Transformers
**Repo:** [sudhanshuraj13/sih_chat](https://github.com/sudhanshuraj13/sih_chat) · [Live Demo](https://sihchatbot-kappa.vercel.app/)

### A.R.G.U.S.
Voice-first AI browser automation agent. LangGraph-orchestrated pipeline converts voice commands into typed automation actions via a custom DOM runtime injected through Chrome extension content scripts.

**Stack:** TypeScript, React 18, Plasmo (MV3), LangGraph, AgentQL
**Repo:** [sudhanshuraj13/A.R.G.U.S](https://github.com/sudhanshuraj13/A.R.G.U.S)

### Edu-filter
Chrome extension that classifies YouTube video titles as educational or distracting via multi-provider LLM support (OpenAI, Groq, Mistral), showing/hiding videos in real time.

**Stack:** Chrome Extension (Manifest V3), DOM Parsing, Multi-Provider LLM
**Repo:** [sudhanshuraj13/Edu-filter](https://github.com/sudhanshuraj13/Edu-filter)

### HR Workflow Designer
Graph-based validation and simulation engine for organizational workflows — cycle detection, missing-link checks, and Start/End placement rules with a React Flow canvas.

**Stack:** Next.js 15, React 19, TypeScript, React Flow
**Repo:** [sudhanshuraj13/hr-workflow-designer](https://github.com/sudhanshuraj13/hr-workflow-designer) · [Live Demo](https://hr-workflow-designer-production.up.railway.app/)

## Portfolio Site Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Zustand
- **Backend:** Node.js, Fastify, TypeScript
- **Database & ORM:** PostgreSQL (via Supabase) & Prisma
- **Message Queue:** Redis (via Upstash) & BullMQ
- **Real-Time:** `@fastify/websocket`
- **AI Chat:** Google Gemini (`@google/genai`)

## Structure

```
apps/
  web/     → Next.js frontend (portfolio pages + interactive console demos)
  server/  → Fastify backend (WebSocket log streaming, job queue, AI chat)
```

---

*Designed and engineered by [Sudhanshu Raj](https://github.com/sudhanshuraj13).*
