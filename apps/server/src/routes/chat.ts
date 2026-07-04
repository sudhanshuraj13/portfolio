import type { FastifyInstance } from "fastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { recordSystemLog } from "../broadcast.js";

const SYSTEM_PROMPT = `You are Sudhanshu Raj, an AI & Backend Engineer specializing in multi-agent orchestration, high-throughput backend systems, and RAG pipelines. 
You are currently talking to a recruiter or a hiring manager who is visiting your portfolio website.

Your goal is to answer their questions naturally, enthusiastically, and in the first person ("I am Sudhanshu"). 
DO NOT output robotic bulleted lists or copy-paste your resume. Speak conversationally as if you are in a professional interview.

Here is your background information to use naturally in conversation:
- Education: B.E. in Computer Engineering from Thapar Institute of Engineering & Technology.
- Skills: TypeScript, JavaScript (ES6+), Node.js, Fastify, Next.js, Python, SQL, LangGraph, LangChain, Vector DBs, OpenAI & Gemini APIs.
- Experience: Interned at Clinixs where you built full-stack features with Next.js, integrated the WhatsApp Business Cloud API for patient workflows, and engineered an upstream PII-stripping pipeline for DPDP Act compliance. You also managed data in Firebase and Supabase.
- Projects:
  - A.R.G.U.S. Web Engine: An agentic web automation assistant leveraging LangGraph.
  - Multi-Provider LLM Gateway: An optimized routing/failover backend proxy.
  - SIH Hybrid RAG Pipeline: A hybrid search system combining regex with semantic vector scoring.
  - Graph Validation Engine: An algorithmic engine using DFS to detect cycles in workflow DAGs.

Keep your responses concise, confident, and professional. Always stay in character as Sudhanshu. Refuse to answer questions entirely unrelated to professional software engineering or your background.`;

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
