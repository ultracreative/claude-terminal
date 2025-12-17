import { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Sparkle, Code } from '@phosphor-icons/react';
import type { ClaudeMessage } from '../../lib/claude';

interface AIChatPanelProps {
  messages: ClaudeMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  currentFile: {
    path: string;
    content: string;
    language: string;
  } | null;
}

export function AIChatPanel({
  messages,
  onSendMessage,
  isLoading,
  currentFile,
}: AIChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickAction = (action: string) => {
    onSendMessage(action);
  };

  return (
    <div className="w-96 bg-terminal-surface border-l border-terminal-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-terminal-border">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Sparkle size={20} weight="fill" className="text-claude-purple" />
          <span>Claude Assistant</span>
        </h3>
        {currentFile && (
          <p className="text-xs text-gray-400 mt-1 truncate" title={currentFile.path}>
            <Code size={12} className="inline mr-1" />
            {currentFile.path.split('/').pop()}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      {currentFile && messages.length === 0 && (
        <div className="p-3 border-b border-terminal-border">
          <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleQuickAction('Explain this code')}
              className="text-xs text-left px-2 py-1.5 rounded bg-terminal-bg hover:bg-terminal-border text-gray-300 transition-colors"
            >
              💡 Explain this code
            </button>
            <button
              onClick={() => handleQuickAction('Add error handling')}
              className="text-xs text-left px-2 py-1.5 rounded bg-terminal-bg hover:bg-terminal-border text-gray-300 transition-colors"
            >
              🛡️ Add error handling
            </button>
            <button
              onClick={() => handleQuickAction('Optimize this code')}
              className="text-xs text-left px-2 py-1.5 rounded bg-terminal-bg hover:bg-terminal-border text-gray-300 transition-colors"
            >
              ⚡ Optimize this code
            </button>
            <button
              onClick={() => handleQuickAction('Add TypeScript types')}
              className="text-xs text-left px-2 py-1.5 rounded bg-terminal-bg hover:bg-terminal-border text-gray-300 transition-colors"
            >
              📘 Add TypeScript types
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto terminal-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Sparkle size={48} weight="duotone" className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">Ask Claude anything about your code</p>
            <p className="text-xs mt-2 text-gray-600">
              I can explain, refactor, debug, or help you write new code
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-claude-purple text-white'
                    : 'bg-terminal-bg text-gray-300'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-terminal-bg text-gray-300 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-claude-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-claude-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-claude-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-terminal-border">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 bg-terminal-bg rounded-lg border border-terminal-border focus-within:border-claude-purple transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentFile ? "Ask about this file..." : "Ask Claude anything..."}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="m-1 px-3 py-1.5 rounded bg-claude-purple text-white text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-600 mt-2">
          Press <kbd className="px-1 py-0.5 bg-terminal-bg rounded text-gray-400">Cmd+K</kbd> to focus
        </p>
      </div>
    </div>
  );
}
