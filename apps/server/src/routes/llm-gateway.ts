import type { FastifyInstance } from "fastify";
import { executionQueue } from "../workers/queue.js";

export async function llmGatewayRoutes(app: FastifyInstance) {
  app.post("/route", async (request, reply) => {
    const { prompt } = request.body as { prompt: string };

    if (!prompt?.trim()) {
      return reply.status(400).send({ error: "Prompt is required" });
    }

    const trace_id = `SR-GATEWAY-${Math.floor(1000 + Math.random() * 9000)}`;

    await executionQueue.add("gateway-job", {
      type: "LLM_GATEWAY",
      trace_id,
      payload: { prompt }
    });

    return reply.send({
      status: "QUEUED",
      trace_id,
      message: "Job dispatched to ai-execution-queue"
    });
  });
}
