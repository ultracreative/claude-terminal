import { type ClaudeMessage } from '../../lib/claude';
import { User, Robot } from '@phosphor-icons/react';

interface ConversationPanelProps {
  messages: ClaudeMessage[];
}

export function ConversationPanel({ messages }: ConversationPanelProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full md:w-96 lg:w-[28rem] bg-terminal-surface border-l border-terminal-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-terminal-border">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Robot size={20} weight="duotone" />
          <span>Conversation with Claude</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 terminal-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-claude-green/20 flex items-center justify-center flex-shrink-0">
                <Robot size={18} weight="duotone" className="text-claude-green" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-claude-green text-white'
                  : 'bg-terminal-bg text-gray-200'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-claude-purple/20 flex items-center justify-center flex-shrink-0">
                <User size={18} weight="duotone" className="text-claude-purple" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
