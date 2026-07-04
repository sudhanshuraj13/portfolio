import type { FastifyInstance } from "fastify";
import { executionQueue } from "../workers/queue.js";

export async function ragSandboxRoutes(app: FastifyInstance) {
  app.post("/search", async (request, reply) => {
    const { query } = request.body as { query: string };

    if (!query?.trim()) {
      return reply.status(400).send({ error: "Query is required" });
    }

    const trace_id = `SR-RAG-${Math.floor(1000 + Math.random() * 9000)}`;

    await executionQueue.add("rag-job", {
      type: "RAG_SANDBOX",
      trace_id,
      payload: { query }
    });

    return reply.send({
      status: "QUEUED",
      trace_id,
      message: "Job dispatched to ai-execution-queue"
    });
  });
}
