"use client";

import { Header } from "@/components/Header";
import { ProjectTabs } from "@/components/ProjectTabs";
import { SystemLogPanel } from "@/components/SystemLogPanel";
import { ChatBubble } from "@/components/ChatBubble";
import { ArgusModule } from "@/components/modules/ArgusModule";
import { LlmGatewayModule } from "@/components/modules/LlmGatewayModule";
import { RagSandboxModule } from "@/components/modules/RagSandboxModule";
import { GraphValidatorModule } from "@/components/modules/GraphValidatorModule";
import { useLogStore } from "@/store/useLogStore";
import { useWebSocket } from "@/hooks/useWebSocket";

const MODULE_COMPONENTS = {
  argus: ArgusModule,
  "llm-gateway": LlmGatewayModule,
  "rag-sandbox": RagSandboxModule,
  "graph-validator": GraphValidatorModule,
} as const;

export default function Home() {
  // Initialize WebSocket connection
  useWebSocket();

  const activeModule = useLogStore((s) => s.activeModule);
  const ActiveComponent = MODULE_COMPONENTS[activeModule];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-base text-primary">
      {/* Top Header */}
      <Header />

      {/* Middle: Sidebar + Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Project Tabs */}
        <ProjectTabs />

        {/* Center: Active Module Workspace */}
        <main className="flex-1 overflow-hidden bg-surface flex flex-col">
          <ActiveComponent />
        </main>
      </div>

      {/* Bottom: System Log Panel */}
      <SystemLogPanel />

      {/* Floating Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
