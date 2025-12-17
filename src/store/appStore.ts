import { create } from 'zustand';
import type { AppMode, Message } from '../types';

interface AppStore {
  mode: AppMode;
  messages: Message[];
  isLoading: boolean;

  setMode: (mode: AppMode) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'terminal',
  messages: [],
  isLoading: false,

  setMode: (mode) => set({ mode }),

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
    ],
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),
}));
