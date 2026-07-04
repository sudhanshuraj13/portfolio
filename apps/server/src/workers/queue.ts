import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
import { argusWorkerLogic } from "./microservices/argusWorker.js";
import { gatewayWorkerLogic } from "./microservices/gatewayWorker.js";
import { ragWorkerLogic } from "./microservices/ragWorker.js";
import { graphWorkerLogic } from "./microservices/graphWorker.js";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../../.env") });

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null
});

export const executionQueue = new Queue("ai-execution-queue", { connection: connection as any });

export const executionWorker = new Worker(
  "ai-execution-queue",
  async (job: Job) => {
    const { type, trace_id, payload } = job.data;
    
    switch (type) {
      case "ARGUS":
        return await argusWorkerLogic(trace_id, payload);
      case "LLM_GATEWAY":
        return await gatewayWorkerLogic(trace_id, payload);
      case "RAG_SANDBOX":
        return await ragWorkerLogic(trace_id, payload);
      case "GRAPH_VALIDATOR":
        return await graphWorkerLogic(trace_id, payload);
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  },
  { connection: connection as any }
);

executionWorker.on("completed", (job) => {
  console.log(`[QUEUE] Job ${job.id} (Trace: ${job.data.trace_id}) completed successfully.`);
});

executionWorker.on("failed", (job, err) => {
  console.error(`[QUEUE] Job ${job?.id} (Trace: ${job?.data.trace_id}) failed: ${err.message}`);
});
