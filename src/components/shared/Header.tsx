import { Terminal, Code, Palette } from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';

export function Header() {
  const { mode, setMode } = useAppStore();

  return (
    <header className="h-12 bg-terminal-surface border-b border-terminal-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold bg-gradient-to-r from-claude-purple to-claude-green bg-clip-text text-transparent">
          Claude Code
        </span>
      </div>

      <div className="flex items-center gap-2 bg-terminal-bg rounded-lg p-1">
        <button
          onClick={() => setMode('terminal')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded transition-all
            ${mode === 'terminal'
              ? 'bg-claude-purple text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          <Terminal weight={mode === 'terminal' ? 'fill' : 'regular'} size={18} />
          <span className="text-sm font-medium">Terminal</span>
        </button>

        <button
          onClick={() => setMode('editor')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded transition-all
            ${mode === 'editor'
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          <Code weight={mode === 'editor' ? 'fill' : 'regular'} size={18} />
          <span className="text-sm font-medium">Editor</span>
        </button>

        <button
          onClick={() => setMode('modular')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded transition-all
            ${mode === 'modular'
              ? 'bg-claude-green text-white'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          <Palette weight={mode === 'modular' ? 'fill' : 'regular'} size={18} />
          <span className="text-sm font-medium">Modular</span>
        </button>
      </div>
    </header>
  );
}
