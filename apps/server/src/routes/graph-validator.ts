import type { FastifyInstance } from "fastify";
import { executionQueue } from "../workers/queue.js";

// Default valid DAG
const VALID_DAG: Record<string, string[]> = {
  Start: ["TaskA", "TaskB"],
  TaskA: ["TaskC"],
  TaskB: ["TaskC"],
  TaskC: ["TaskD"],
  TaskD: ["End"],
  End: [],
};

// Broken DAG with cycle
const CYCLIC_DAG: Record<string, string[]> = {
  Start: ["TaskA", "TaskB"],
  TaskA: ["TaskC"],
  TaskB: ["TaskC"],
  TaskC: ["TaskD"],
  TaskD: ["TaskB"], // cycle: TaskD → TaskB → TaskC → TaskD
  End: [],
};

export async function graphValidatorRoutes(app: FastifyInstance) {
  app.get("/defaults", async (_request, reply) => {
    return reply.send({
      valid: VALID_DAG,
      cyclic: CYCLIC_DAG,
    });
  });

  app.post("/validate", async (request, reply) => {
    const { adjacencyList, useBroken } = request.body as {
      adjacencyList?: Record<string, string[]>;
      useBroken?: boolean;
    };

    const graph = useBroken ? CYCLIC_DAG : adjacencyList || VALID_DAG;
    const trace_id = `SR-GRAPH-${Math.floor(1000 + Math.random() * 9000)}`;

    await executionQueue.add("graph-job", {
      type: "GRAPH_VALIDATOR",
      trace_id,
      payload: { adjacencyList: graph, useBroken }
    });

    return reply.send({
      status: "QUEUED",
      trace_id,
      message: "Job dispatched to ai-execution-queue"
    });
  });
}
