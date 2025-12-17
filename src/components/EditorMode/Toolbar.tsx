import { Sidebar, FloppyDisk, FolderOpen, Sparkle } from '@phosphor-icons/react';
import type { OpenFile } from './EditorMode';

interface ToolbarProps {
  showFileExplorer: boolean;
  onToggleFileExplorer: () => void;
  showAIPanel: boolean;
  onToggleAIPanel: () => void;
  activeFile: OpenFile | undefined;
  onSave?: () => void;
}

export function Toolbar({
  showFileExplorer,
  onToggleFileExplorer,
  showAIPanel,
  onToggleAIPanel,
  activeFile,
  onSave,
}: ToolbarProps) {
  return (
    <div className="h-10 bg-terminal-surface border-b border-terminal-border flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFileExplorer}
          className={`
            p-1.5 rounded transition-colors
            ${showFileExplorer ? 'bg-terminal-bg text-claude-green' : 'text-gray-400 hover:text-white hover:bg-terminal-bg'}
          `}
          title="Toggle File Explorer"
        >
          <Sidebar size={18} weight={showFileExplorer ? 'fill' : 'regular'} />
        </button>

        <button
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-terminal-bg transition-colors"
          title="Open Folder"
        >
          <FolderOpen size={18} />
        </button>

        {activeFile && onSave && (
          <button
            onClick={onSave}
            className={`
              p-1.5 rounded transition-colors flex items-center gap-1
              ${activeFile.isDirty
                ? 'text-claude-green hover:bg-terminal-bg'
                : 'text-gray-600 cursor-not-allowed'
              }
            `}
            disabled={!activeFile.isDirty}
            title={`Save ${activeFile.isDirty ? '(Cmd+S)' : ''}`}
          >
            <FloppyDisk size={18} weight={activeFile.isDirty ? 'fill' : 'regular'} />
          </button>
        )}

        <div className="w-px h-6 bg-terminal-border" />

        <button
          onClick={onToggleAIPanel}
          className={`
            p-1.5 rounded transition-colors
            ${showAIPanel ? 'bg-terminal-bg text-claude-purple' : 'text-gray-400 hover:text-white hover:bg-terminal-bg'}
          `}
          title="Toggle AI Assistant (Cmd+K)"
        >
          <Sparkle size={18} weight={showAIPanel ? 'fill' : 'regular'} />
        </button>
      </div>

      {activeFile && (
        <div className="text-xs text-gray-400">
          {activeFile.path}
        </div>
      )}
    </div>
  );
}
