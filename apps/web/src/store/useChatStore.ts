import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
}

let chatCounter = 0;

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: `chat-${++chatCounter}-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}));
