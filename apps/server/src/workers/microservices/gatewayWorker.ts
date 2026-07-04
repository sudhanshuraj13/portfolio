import { recordSystemLog } from "../../broadcast.js";

export async function gatewayWorkerLogic(trace_id: string, payload: { prompt: string }) {
  const startTime = Date.now();

  try {
    await recordSystemLog(trace_id, "SYSTEM", "LLM_GATEWAY", "INIT", "Initializing inference proxy...", 0, "SUCCESS");
    await recordSystemLog(trace_id, "INFO", "ROUTER", "SELECT_PROVIDER", "Routing to Primary Provider (Groq-Llama-3)...", 0, "SUCCESS");
    
    // Simulate primary provider failure
    await recordSystemLog(trace_id, "WARN", "GROQ_API", "RATE_LIMIT", "HTTP 429 Too Many Requests — Provider overloaded", 250, "SUCCESS");
    await recordSystemLog(trace_id, "ERROR", "ROUTER", "FAILOVER_INIT", "Primary provider failed. Initiating automatic failover...", 0, "ERROR");
    
    // Simulate fallback
    await recordSystemLog(trace_id, "INFO", "ROUTER", "SELECT_PROVIDER", "Routing to Fallback Provider (Gemini-1.5-Pro)...", 100, "SUCCESS");
    await recordSystemLog(trace_id, "SUCCESS", "GEMINI_API", "INFERENCE_COMPLETE", "Inference successful via fallback.", 800, "SUCCESS");
    
    const elapsed = Date.now() - startTime;
    await recordSystemLog(trace_id, "SUCCESS", "LLM_GATEWAY", "COMPLETE", `Request fulfilled in ${elapsed}ms.`, elapsed, "SUCCESS");

    return {
      status: "SUCCESS",
      provider_used: "Gemini-1.5-Pro",
      failover_triggered: true,
      execution_time_ms: elapsed
    };

  } catch (err: any) {
    await recordSystemLog(trace_id, "ERROR", "LLM_GATEWAY", "FATAL_ERROR", `Worker failed: ${err.message}`, Date.now() - startTime, "ERROR");
    throw err;
  }
}
