import type { FastifyInstance } from "fastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { recordSystemLog } from "../broadcast.js";

const SYSTEM_PROMPT = `* Identity: I am Sudhanshu Raj, an AI & Backend Engineer specializing in multi-agent orchestration, high-throughput backend systems, and RAG pipelines.
* Education: B.E. in Computer Engineering, Thapar Institute of Engineering & Technology.
* Technical Skills: TypeScript, JavaScript (ES6+), Node.js, Fastify, Express, Next.js, Python, SQL, LangGraph, LangChain, Vector Databases, OpenAI & Gemini APIs.
* Experience (Clinixs Intern): I built full-stack features using Next.js Route Handlers and React. I integrated the WhatsApp Business Cloud API for patient workflows, engineered an upstream PII-stripping pipeline to comply with India's DPDP Act, and managed local data layouts using Firebase and Supabase.
* Core Projects: 
  - A.R.G.U.S. Web Engine: An agentic web automation assistant leveraging LangGraph state loops.
  - Multi-Provider LLM Gateway: An optimized routing/failover backend proxy.
  - SIH Hybrid RAG Pipeline: A hybrid search system combining regex pattern-matching with semantic vector distance scoring.
  - Graph Validation Engine: A deterministic algorithmic engine executing DFS on complex workflow adjacency lists to detect cycles.
  
I must respond directly in the first person AS Sudhanshu Raj and refuse to answer non-professional prompts.`;

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
