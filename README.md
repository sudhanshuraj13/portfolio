# Sudhanshu Raj — Enterprise AI Operations Platform

Welcome to the backend architecture showcase of my portfolio! 

I built this **Enterprise AI Operations Platform** to demonstrate production-grade backend engineering, microservices architecture, and real-time observability for senior engineering roles.

Rather than a simple CRUD application, this platform simulates a high-throughput, event-driven enterprise environment.

## 🚀 Architectural Overview

This system is designed as a decoupled `pnpm` monorepo, separating the client-facing dashboard from the heavy AI execution workers.

Instead of traditional synchronous HTTP APIs that block and time out during long LLM generations, this architecture is completely **asynchronous and event-driven**:
1. The **Next.js frontend** dispatches tasks to a distributed execution queue.
2. The **Fastify worker pool** (consumer) asynchronously processes these jobs via **BullMQ / Redis**.
3. As the workers execute complex AI microservices, they stream granular execution traces and latency metrics back to the frontend in real-time via **WebSockets**.

## 🧠 Core Microservices

I engineered four distinct AI microservices that operate entirely in the background:

- **A.R.G.U.S (Automated Risk Guard & Understanding System):**
  An autonomous stateful agent powered by LangGraph. It extracts intents from commands, dispatches web searches, and evaluates payload risk levels before execution.
- **LLM Gateway:**
  A resilient model router acting as a reverse-proxy for the Google Gemini API, handling context injection, persona enforcement, and latency tracking.
- **Local RAG Sandbox:**
  A two-lane hybrid search architecture. It combines fast regex exact matching with local semantic similarity scoring, eliminating external embedding API costs and rate limits.
- **Graph Validator:**
  A directed acyclic graph (DAG) topological traversal engine that dynamically validates organizational workflows for dead-ends and cyclic dependencies.

## 🛠️ Technology Stack

- **Backend:** Node.js, Fastify, TypeScript
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Zustand
- **Database & ORM:** PostgreSQL (via Supabase) & Prisma
- **Message Broker:** Redis (via Upstash) & BullMQ
- **Real-Time:** `@fastify/websocket`
- **AI Integration:** Google Gemini (`@google/genai`)

## 📊 Telemetry & Observability

Enterprise systems require strict observability. Every microservice in this platform generates standard `SystemLog` objects that include a `trace_id`, execution `latency_ms`, and `risk_level`. 

These logs are both persisted to the PostgreSQL database for historical analytics and broadcasted over WebSockets for real-time monitoring in the dashboard's "Live Traces" panel—simulating a Datadog-style observability suite.

---

*Designed and engineered by [Sudhanshu Raj](https://github.com/sudhanshuraj13).*
