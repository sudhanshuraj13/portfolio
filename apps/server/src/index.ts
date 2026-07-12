import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { clients } from "./broadcast.js";
import { argusRoutes } from "./routes/argus.js";
import { llmGatewayRoutes } from "./routes/llm-gateway.js";
import { ragSandboxRoutes } from "./routes/rag-sandbox.js";
import { graphValidatorRoutes } from "./routes/graph-validator.js";
import { chatRoutes } from "./routes/chat.js";
import { telemetryRoutes } from "./routes/telemetry.js";
import "./workers/queue.js";

import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", "..", "..", ".env") });

const PORT = parseInt(process.env.PORT || "4000", 10);

async function main() {
  const app = Fastify({ logger: false });

  // CORS — allow all origins for the portfolio
  await app.register(cors, {
    origin: true, // Allows any origin (Vercel, localhost, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  // WebSocket support
  await app.register(websocket);

  // Global WebSocket endpoint for log streaming
  app.get("/ws", { websocket: true }, (socket, _req) => {
    clients.add(socket);
    console.log(`[WS] Client connected. Total: ${clients.size}`);

    socket.on("close", () => {
      clients.delete(socket);
      console.log(`[WS] Client disconnected. Total: ${clients.size}`);
    });

    socket.on("error", (err) => {
      console.error("[WS] Socket error:", err.message);
      clients.delete(socket);
    });

    // Send initial connection confirmation
    socket.send(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "SYSTEM",
        source: "CORE",
        message: "WebSocket connection established. Portfolio backend connected.",
      })
    );
  });

  // Register route modules
  await app.register(argusRoutes, { prefix: "/api/argus" });
  await app.register(llmGatewayRoutes, { prefix: "/api/llm-gateway" });
  await app.register(ragSandboxRoutes, { prefix: "/api/rag" });
  await app.register(graphValidatorRoutes, { prefix: "/api/graph" });
  await app.register(chatRoutes, { prefix: "/api/chat" });
  await app.register(telemetryRoutes, { prefix: "/api/telemetry" });

  // Health check
  app.get("/api/health", async () => ({
    status: "operational",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connectedClients: clients.size,
  }));

  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║  Portfolio Backend — Fastify + WebSocket             ║`);
  console.log(`║  HTTP:  http://localhost:${PORT}                       ║`);
  console.log(`║  WS:    ws://localhost:${PORT}/ws                      ║`);
  console.log(`╚══════════════════════════════════════════════════════╝\n`);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
