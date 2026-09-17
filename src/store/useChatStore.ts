/**
 * Chat history for /chat, keyed by user ID. In memory only: survives closing
 * and reopening the chat screen, cleared when the app restarts. (The web app
 * persists it to localStorage; native persistence can come later.)
 */

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  isError?: boolean;
}

export const welcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  sender: 'coach',
  text: 'Salam! Main aapka health coach "Dost" hoon. Aaj aapne kya khaya aur kya workout kiya? Mujhe natural language main batao aur main logs add kar doonga!',
});

interface ChatState {
  histories: Record<string, ChatMessage[]>;
  addMessage: (userId: string, msg: Omit<ChatMessage, 'id'>) => void;
  clear: (userId: string) => void;
}

let nextId = 0;

export const useChatStore = create<ChatState>()((set) => ({
  histories: {},
  addMessage: (userId, msg) =>
    set((state) => ({
      histories: {
        ...state.histories,
        [userId]: [...(state.histories[userId] ?? [welcomeMessage()]), { ...msg, id: `m${++nextId}` }],
      },
    })),
  clear: (userId) =>
    set((state) => ({ histories: { ...state.histories, [userId]: [welcomeMessage()] } })),
}));
