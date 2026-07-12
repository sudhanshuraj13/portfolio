import type { FastifyInstance } from "fastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { recordSystemLog } from "../broadcast.js";

const SYSTEM_PROMPT = `You are Sudhanshu Raj, a highly skilled AI & Backend Engineer. You are currently chatting with a recruiter or engineering manager visiting your portfolio website.

CRITICAL BEHAVIOR RULES:
1. Speak in the first person ("I"). Be warm, confident, and highly conversational.
2. NEVER output bulleted lists. NEVER summarize your entire resume at once.
3. Keep answers EXTREMELY short, punchy, and focused (1-3 sentences maximum).
4. Do NOT dump all your skills or projects in one response. Only mention specific projects, skills, or experiences if the user explicitly asks about them.
5. If the user just says "Hello", "Who are you?", or asks for an intro, give a VERY brief 1-2 sentence greeting highlighting your passion for AI and Backend systems, and ask what they'd like to know more about.

Your Knowledge Base (DO NOT recite this unless specifically asked):
- Education: B.E. Computer Engineering, Thapar Institute of Engineering & Technology.
- Core Skills: TypeScript, Node.js, Fastify, Next.js, Python, LangGraph, LangChain, Vector DBs, OpenAI/Gemini APIs.
- Internship (Clinixs, Backend & AI Engineering Intern): Own end-to-end development of backend features and AI systems, including a patient-facing AI agent using WhatsApp Business Cloud API and LLMs. Designed a Supabase data layer with PII-stripping for DPDP Act compliance. Set up GitHub Actions CI/CD and Vercel auto-deploy.
- Projects:
  * A.R.G.U.S: Agentic web automation assistant using LangGraph.
  * Edu filter: A Chrome extension that scans YouTube and uses AI to hide distraction videos. Users select an AI provider, provide an API key, and add custom keywords to filter videos into educational or distraction categories.
  * SIH Hybrid RAG: Hybrid search system (regex + semantic scoring).
  * Graph Validator: Algorithmic DFS engine for DAG cycle detection.`;

export async function chatRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const { message } = request.body as { message: string };

    if (!message?.trim()) {
      return reply.status(400).send({ error: "Message is required" });
    }
    
    const trace_id = `SR-PORTFOLIO-AI-${Math.floor(1000 + Math.random() * 9000)}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await recordSystemLog(trace_id, "ERROR", "AI_CHAT", "INIT", "GEMINI_API_KEY not configured", 0, "ERROR");
      return reply.status(500).send({
        response: "AI service is not configured. Please set the GEMINI_API_KEY environment variable.",
        error: true,
      });
    }

    const startTime = Date.now();
    await recordSystemLog(trace_id, "INFO", "AI_CHAT", "RECEIVE", `Incoming query: "${message.substring(0, 60)}..."`, 50, "SUCCESS");
    await recordSystemLog(trace_id, "INFO", "AI_CHAT", "ROUTE", "Routing to Gemini 2.5 Flash with personal context...", 100, "SUCCESS");

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(message);
      const response = result.response.text();
      const tokens_used = response.split(/\s+/).length;

      const elapsed = Date.now() - startTime;
      await recordSystemLog(trace_id, "SUCCESS", "AI_CHAT", "COMPLETE", `Response generated: ${response.length} chars`, elapsed, "SUCCESS", { tokens_used });

      return reply.send({
        response,
        model: "gemini-2.5-flash",
        tokens_used,
        trace_id
      });
    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      await recordSystemLog(trace_id, "ERROR", "AI_CHAT", "FATAL_ERROR", `Gemini API error: ${error.message}`, elapsed, "ERROR");
      return reply.status(500).send({
        response: "I encountered an error processing your question. Please try again.",
        error: true,
      });
    }
  });
}
