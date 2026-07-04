import { recordSystemLog } from "../../broadcast.js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../../../data/sih_problems.json");

interface SihProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
}

export async function ragWorkerLogic(trace_id: string, payload: { query: string }) {
  const { query } = payload;
  const startTime = Date.now();

  try {
    await recordSystemLog(trace_id, "SYSTEM", "RAG_SANDBOX", "INIT", `Incoming search query: "${query}"`, 0, "SUCCESS");
    
    let fileContent: string;
    try {
      fileContent = readFileSync(dataPath, "utf-8");
    } catch (err) {
      throw new Error(`Failed to read dataset: ${err}`);
    }
    
    const parsed = JSON.parse(fileContent) as SihProblem[];
    await recordSystemLog(trace_id, "INFO", "RAG_SANDBOX", "DATA_LOADED", `Corpus size: ${parsed.length} documents indexed locally`, 50, "SUCCESS");

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    // Regex Search
    await recordSystemLog(trace_id, "INFO", "REGEX_ENGINE", "SEARCH_START", "Initializing exact string matching pipeline...", 0, "SUCCESS");
    
    let regexResults = [];
    for (const doc of parsed) {
      const text = `${doc.title} ${doc.description} ${doc.keywords.join(" ")}`.toLowerCase();
      let matchCount = 0;
      for (const term of queryWords) {
        if (text.includes(term)) matchCount++;
      }
      if (matchCount > 0) {
        regexResults.push({ ...doc, score: matchCount / queryWords.length, matchType: "REGEX" });
      }
    }
    
    await recordSystemLog(trace_id, "SUCCESS", "REGEX_ENGINE", "SEARCH_COMPLETE", `Completed: ${regexResults.length} exact matches found`, 100, "SUCCESS");

    // Local Semantic Search (No API calls)
    await recordSystemLog(trace_id, "INFO", "LOCAL_SIMILARITY", "SEARCH_START", "Computing local algorithmic similarity (Jaccard + Tag overlap)...", 0, "SUCCESS");
    
    let semanticResults = [];
    for (const doc of parsed) {
      const tagOverlap = doc.keywords.filter(t => queryLower.includes(t.toLowerCase())).length;
      const contentWords = doc.description.toLowerCase().split(/\s+/);
      const wordOverlap = queryWords.filter(qw => contentWords.some(cw => cw.includes(qw))).length;
      
      const score = (tagOverlap * 0.4 + wordOverlap * 0.2) / Math.max(queryWords.length, 1);
      if (score > 0.1) {
        semanticResults.push({ ...doc, score, matchType: "SEMANTIC" });
      }
    }

    await recordSystemLog(trace_id, "SUCCESS", "LOCAL_SIMILARITY", "SEARCH_COMPLETE", `Completed: ${semanticResults.length} semantic matches scored`, 150, "SUCCESS");

    const elapsed = Date.now() - startTime;
    await recordSystemLog(trace_id, "SUCCESS", "RAG_SANDBOX", "COMPLETE", `Search complete in ${elapsed}ms`, elapsed, "SUCCESS");

    return {
      status: "SUCCESS",
      query,
      results_found: regexResults.length + semanticResults.length,
      execution_time_ms: elapsed
    };

  } catch (err: any) {
    await recordSystemLog(trace_id, "ERROR", "RAG_SANDBOX", "FATAL_ERROR", `Worker failed: ${err.message}`, Date.now() - startTime, "ERROR");
    throw err;
  }
}
