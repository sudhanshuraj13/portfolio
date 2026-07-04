"use client";

import { Mail, Phone, Code, Briefcase, Wifi, WifiOff } from "lucide-react";
import { useLogStore } from "@/store/useLogStore";

export function Header() {
  const wsConnected = useLogStore((s) => s.wsConnected);

  return (
    <header className="h-14 min-h-14 border-b border-border bg-surface-alt flex items-center px-4 gap-4 select-none">
      {/* Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsConnected
                ? "bg-terminal-green shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                : "bg-error"
            }`}
          />
          <h1 className="text-sm font-semibold text-primary tracking-tight">
            SUDHANSHU RAJ
          </h1>
        </div>
        <span className="text-dim text-xs font-mono">|</span>
        <span className="text-muted text-xs uppercase tracking-wider">
          AI & Backend Engineer
        </span>
      </div>

      {/* Description — hidden on small screens */}
      <p className="hidden lg:block text-xs text-dim flex-1 mx-6 font-mono truncate">
        Specializing in multi-agent orchestration, LLM inference routing, and
        high-availability backend systems.
      </p>

      {/* Spacer */}
      <div className="flex-1 lg:hidden" />

      {/* Contact Links */}
      <div className="flex items-center gap-1">
        <a
          href="mailto:sujalkashyap4803@gmail.com"
          className="p-2 text-dim hover:text-terminal-green transition-colors"
          title="Email"
        >
          <Mail size={15} />
        </a>
        <a
          href="tel:+919155448358"
          className="p-2 text-dim hover:text-terminal-green transition-colors"
          title="Phone"
        >
          <Phone size={15} />
        </a>
        <a
          href="https://github.com/sudhanshuraj13"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-dim hover:text-terminal-green transition-colors"
          title="GitHub"
        >
          <Code size={15} />
        </a>
        <a
          href="https://www.linkedin.com/in/sudhanshu-raj-21a638250"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-dim hover:text-terminal-green transition-colors"
          title="LinkedIn"
        >
          <Briefcase size={15} />
        </a>

        {/* WS Status */}
        <div
          className={`ml-2 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono border ${
            wsConnected
              ? "border-terminal-green/30 text-terminal-green bg-terminal-green/5"
              : "border-error/30 text-error bg-error/5"
          }`}
        >
          {wsConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
          {wsConnected ? "CONNECTED" : "OFFLINE"}
        </div>
      </div>
    </header>
  );
}
