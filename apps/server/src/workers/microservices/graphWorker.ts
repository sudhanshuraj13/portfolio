import { recordSystemLog } from "../../broadcast.js";

export async function graphWorkerLogic(trace_id: string, payload: { adjacencyList: Record<string, string[]>, useBroken: boolean }) {
  const { adjacencyList, useBroken } = payload;
  const startTime = Date.now();

  try {
    const graphType = useBroken ? "CYCLIC_DAG" : "USER_DEFINED";
    await recordSystemLog(trace_id, "SYSTEM", "GRAPH_RUNTIME", "INIT", `Initializing DAG validation — mode: ${graphType}`, 0, "SUCCESS");
    await recordSystemLog(trace_id, "INFO", "DFS_ENGINE", "TRAVERSE_START", "Starting Depth-First Search traversal...", 50, "SUCCESS");
    
    const visited = new Set<string>();
    const inStack = new Set<string>();
    let cycleNode: string | undefined;

    async function dfs(node: string): Promise<boolean> {
      if (inStack.has(node)) {
        cycleNode = node;
        await recordSystemLog(trace_id, "ERROR", "DFS_ENGINE", "CYCLE_DETECTED", `Cycle detected at Node ${node}. Validation Failed.`, 0, "ERROR");
        return false;
      }
      if (visited.has(node)) {
        await recordSystemLog(trace_id, "INFO", "DFS_ENGINE", "SKIP", `Node ${node} — already visited, skipping`, 0, "SUCCESS");
        return true;
      }

      visited.add(node);
      inStack.add(node);
      await recordSystemLog(trace_id, "INFO", "DFS_ENGINE", "VISIT", `Visiting Node: ${node}...`, 50, "SUCCESS");

      const neighbors = adjacencyList[node] || [];
      for (const neighbor of neighbors) {
        await recordSystemLog(trace_id, "INFO", "DFS_ENGINE", "TRAVERSE", `  → Traversing edge to ${neighbor}`, 20, "SUCCESS");
        const valid = await dfs(neighbor);
        if (!valid) return false;
      }

      inStack.delete(node);
      await recordSystemLog(trace_id, "SUCCESS", "DFS_ENGINE", "COMPLETE", `  ✓ Node ${node} — all children explored`, 0, "SUCCESS");
      return true;
    }

    const allNodes = Object.keys(adjacencyList);
    let valid = true;
    for (const node of allNodes) {
      if (!visited.has(node)) {
        const result = await dfs(node);
        if (!result) {
          valid = false;
          break;
        }
      }
    }

    const elapsed = Date.now() - startTime;
    if (valid) {
      await recordSystemLog(trace_id, "SUCCESS", "GRAPH_RUNTIME", "VALID", `DAG validation PASSED in ${elapsed}ms.`, elapsed, "SUCCESS");
      return { status: "SUCCESS", valid: true, execution_time_ms: elapsed };
    } else {
      await recordSystemLog(trace_id, "ERROR", "GRAPH_RUNTIME", "INVALID", `DAG validation FAILED. Cycle at node "${cycleNode}".`, elapsed, "ERROR");
      return { status: "FAILED", valid: false, cycleNode, execution_time_ms: elapsed };
    }

  } catch (err: any) {
    await recordSystemLog(trace_id, "ERROR", "GRAPH_RUNTIME", "FATAL_ERROR", `Worker failed: ${err.message}`, Date.now() - startTime, "ERROR");
    throw err;
  }
}
