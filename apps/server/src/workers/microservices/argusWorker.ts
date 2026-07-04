import { recordSystemLog, streamLog } from "../../broadcast.js";

export async function argusWorkerLogic(trace_id: string, payload: { command: string }) {
  const { command } = payload;
  const startTime = Date.now();

  try {
    await recordSystemLog(trace_id, "SYSTEM", "ARGUS", "RECEIVED_COMMAND", `Received voice command: "${command}"`, 0, "SUCCESS");
    
    // Phase 1: Intent
    await recordSystemLog(trace_id, "INFO", "INTENT_EXTRACTOR", "NLU_INIT", "Initializing NLU pipeline...", 0, "SUCCESS");
    
    const words = command.toLowerCase().split(/\s+/);
    const hasPurchaseIntent = words.some((w) => ["buy", "purchase", "order", "checkout"].includes(w));
    
    await recordSystemLog(trace_id, "SUCCESS", "INTENT_EXTRACTOR", "GOAL_EXTRACTED", `Goal extracted. Purchase Intent: ${hasPurchaseIntent}`, Date.now() - startTime, "SUCCESS");
    
    // Phase 2: Web Search Context
    await recordSystemLog(trace_id, "INFO", "TINYFISH_API", "SEARCH_DISPATCH", "Dispatching contextual web search...", 0, "SUCCESS");
    
    // Phase 3: Risk Classification (The prompt's directive)
    if (hasPurchaseIntent) {
      await recordSystemLog(trace_id, "WARN", "RiskClassifier", "RISK_EVALUATION", "⚠ PURCHASE INTENT DETECTED in command payload", 0, "SUCCESS");
      await recordSystemLog(trace_id, "ERROR", "RiskClassifier", "TRANSACTION_BLOCKED", "Execution PAUSED. Manual User Approval Required.", Date.now() - startTime, "ERROR");
      
      return {
        status: "APPROVAL_REQUIRED",
        reason: "Purchase intent detected — financial transaction requires manual approval",
        risk_level: "HIGH"
      };
    }

    await recordSystemLog(trace_id, "SUCCESS", "ARGUS", "WORKFLOW_COMPLETE", "Automation sequence validated and dispatched.", Date.now() - startTime, "SUCCESS");
    
    return {
      status: "READY",
      risk_level: "LOW"
    };

  } catch (err: any) {
    await recordSystemLog(trace_id, "ERROR", "ARGUS", "FATAL_ERROR", `Worker failed: ${err.message}`, Date.now() - startTime, "ERROR");
    throw err;
  }
}

export async function argusApproveWorkerLogic(trace_id: string, payload: { command: string }) {
  const startTime = Date.now();
  try {
    await recordSystemLog(trace_id, "INFO", "ARGUS", "USER_OVERRIDE", "Manual execution approval received. Resuming transaction...", 0, "SUCCESS");
    await recordSystemLog(trace_id, "INFO", "TRANSACTION_ENGINE", "SECURE_CHECKOUT", "Initiating secure checkout sequence for Amazon cart...", 50, "SUCCESS");
    await recordSystemLog(trace_id, "INFO", "TRANSACTION_ENGINE", "PAYMENT_METHOD", "Applying default payment method: Cash on Delivery...", 100, "SUCCESS");
    
    // Simulate booking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    await recordSystemLog(trace_id, "SUCCESS", "TRANSACTION_ENGINE", "ORDER_CONFIRMED", "Order placed successfully! Extracting delivery ETA...", 850, "SUCCESS");
    
    const elapsed = Date.now() - startTime;
    await recordSystemLog(trace_id, "SUCCESS", "ARGUS", "COMPLETE", `Automation completed in ${elapsed}ms.`, elapsed, "SUCCESS");

    return {
      status: "BOOKED",
      item: "Blue shirt (Amazon)",
      payment: "Cash on Delivery",
      delivery_eta: "4-5 business days",
      execution_time_ms: elapsed
    };
  } catch (err: any) {
    await recordSystemLog(trace_id, "ERROR", "ARGUS", "FATAL_ERROR", `Approve worker failed: ${err.message}`, Date.now() - startTime, "ERROR");
    throw err;
  }
}
