import { useState, type FormEvent } from 'react';
import { PaperPlaneRight } from '@phosphor-icons/react';

interface InputAreaProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function InputArea({
  onSubmit,
  isLoading = false,
  placeholder = "What would you like to create?",
}: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-terminal-surface border-t border-terminal-border">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 bg-terminal-bg rounded-xl border border-terminal-border focus-within:border-claude-green transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="
              flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500
              focus:outline-none
            "
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="
              m-2 px-4 py-2 rounded-lg bg-claude-green text-white font-medium
              hover:bg-claude-green-light disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center gap-2
            "
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <PaperPlaneRight size={18} weight="fill" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
