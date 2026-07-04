"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export function ChatBubble() {
  const { messages, isOpen, isLoading, toggle, addMessage, setLoading } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage({ role: "user", content: userMessage });
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      addMessage({
        role: "assistant",
        content: data.response || "I couldn't process that. Please try again.",
      });
    } catch {
      addMessage({
        role: "assistant",
        content: "Connection error. The backend server may be offline.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[28rem] bg-surface border border-border rounded-lg shadow-2xl shadow-black/50 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-terminal-green shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-semibold text-primary">
                Sudhanshu Raj
              </span>
              <span className="text-[10px] font-mono text-dim">
                AI
              </span>
            </div>
            <button
              onClick={toggle}
              className="text-dim hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <div className="text-2xl">👨‍💻</div>
                <p className="text-xs text-muted">
                  Hi! Ask me anything about my skills, projects, or experience.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {[
                    "What are your core skills?",
                    "Tell me about ARGUS",
                    "What tech stack do you use?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="text-[10px] font-mono px-2 py-1 border border-border rounded text-muted hover:text-terminal-green hover:border-terminal-green/30 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${msg.role === "user"
                      ? "bg-terminal-green/15 text-terminal-green border border-terminal-green/20"
                      : "bg-surface-alt text-primary border border-border"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-alt border border-border px-3 py-2 rounded-lg">
                  <Loader2 size={14} className="animate-spin text-amber" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-2 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-base border border-border rounded px-3 py-1.5 text-xs text-primary placeholder-dim font-mono focus:outline-none focus:border-terminal-green/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 py-1.5 bg-terminal-green/15 border border-terminal-green/30 rounded text-terminal-green hover:bg-terminal-green/25 transition-colors disabled:opacity-30"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-surface border border-terminal-green/30 rounded-full shadow-lg shadow-black/30 hover:border-terminal-green/60 hover:shadow-terminal-green/10 transition-all group"
      >
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border border-terminal-green/40 pulse-ring" />
        )}

        <MessageCircle
          size={16}
          className="text-terminal-green group-hover:scale-110 transition-transform"
        />
        <span className="text-xs font-mono text-muted group-hover:text-primary transition-colors">
          {isOpen ? "Close" : "Chat with me!"}
        </span>
      </button>
    </>
  );
}
