import type { FastifyInstance } from "fastify";
import { executionQueue } from "../workers/queue.js";

export async function argusRoutes(app: FastifyInstance) {
  app.post("/execute", async (request, reply) => {
    const { command } = request.body as { command: string };

    if (!command?.trim()) {
      return reply.status(400).send({ error: "Command is required" });
    }

    const trace_id = `SR-ARGUS-${Math.floor(1000 + Math.random() * 9000)}`;

    await executionQueue.add("argus-job", {
      type: "ARGUS",
      trace_id,
      payload: { command }
    });

    return reply.send({
      status: "QUEUED",
      trace_id,
      message: "Job dispatched to ai-execution-queue"
    });
  });

  app.post("/approve", async (request, reply) => {
    const { command, trace_id } = request.body as { command: string, trace_id: string };

    if (!trace_id) {
      return reply.status(400).send({ error: "Trace ID is required" });
    }

    await executionQueue.add("argus-job", {
      type: "ARGUS_APPROVE",
      trace_id,
      payload: { command }
    });

    return reply.send({
      status: "QUEUED",
      trace_id,
      message: "Approval job dispatched to ai-execution-queue"
    });
  });
}
