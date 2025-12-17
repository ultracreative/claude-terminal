export type AppMode = 'terminal' | 'editor' | 'modular';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TerminalSession {
  id: string;
  messages: Message[];
  isActive: boolean;
}
