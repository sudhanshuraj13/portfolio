import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { executionQueue } from "../workers/queue.js";

export async function telemetryRoutes(app: FastifyInstance) {
  app.get("/", async (_request, reply) => {
    try {
      const dbCount = await prisma.systemLog.count();
      
      const successCount = await prisma.systemLog.count({
        where: { status: "SUCCESS" },
      });

      const queueDepth = await executionQueue.getJobCounts('wait', 'active', 'delayed');

      const recentLogs = await prisma.systemLog.findMany({
        where: { status: "SUCCESS", latency_ms: { gt: 0 } },
        orderBy: { timestamp: "desc" },
        take: 100,
      });

      let p99 = 0;
      if (recentLogs.length > 0) {
        const sortedLatencies = recentLogs.map(l => l.latency_ms).sort((a, b) => a - b);
        const p99Index = Math.floor(sortedLatencies.length * 0.99);
        p99 = sortedLatencies[p99Index] || sortedLatencies[sortedLatencies.length - 1];
      }

      // Estimate LLM token cost (fake calculation based on metadata for demonstration)
      const chatLogs = await prisma.systemLog.findMany({
        where: { microservice: "AI_CHAT", action: "COMPLETE" },
      });
      let totalTokens = 0;
      chatLogs.forEach(l => {
        if (l.metadata) {
          try {
            const meta = JSON.parse(l.metadata.toString());
            if (meta.tokens_used) totalTokens += meta.tokens_used;
          } catch (e) {}
        }
      });
      const estimatedCost = (totalTokens / 1000) * 0.002; // $0.002 per 1k tokens assumption

      return reply.send({
        status: "OK",
        total_logs: dbCount,
        success_rate: dbCount > 0 ? (successCount / dbCount) * 100 : 100,
        p99_latency_ms: p99,
        queue_depth: queueDepth.wait + queueDepth.active,
        llm_tokens_used: totalTokens,
        estimated_llm_cost_usd: estimatedCost
      });
    } catch (err: any) {
      return reply.status(500).send({ error: "Failed to fetch telemetry", details: err.message });
    }
  });
}
