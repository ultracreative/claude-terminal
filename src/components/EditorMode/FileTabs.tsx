import { X } from '@phosphor-icons/react';
import type { OpenFile } from './EditorMode';

interface FileTabsProps {
  files: OpenFile[];
  activeFilePath: string | null;
  onFileSelect: (path: string) => void;
  onFileClose: (path: string) => void;
  onFileSave: (path: string) => void;
}

export function FileTabs({
  files,
  activeFilePath,
  onFileSelect,
  onFileClose,
}: FileTabsProps) {
  if (files.length === 0) return null;

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  const getFileIcon = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return '📘';
      case 'js':
      case 'jsx':
        return '📙';
      case 'json':
        return '📋';
      case 'css':
        return '🎨';
      case 'html':
        return '🌐';
      case 'md':
        return '📝';
      case 'rs':
        return '🦀';
      case 'py':
        return '🐍';
      default:
        return '📄';
    }
  };

  return (
    <div className="flex items-center bg-terminal-surface border-b border-terminal-border overflow-x-auto">
      {files.map((file) => (
        <div
          key={file.path}
          className={`
            flex items-center gap-2 px-3 py-2 border-r border-terminal-border cursor-pointer
            transition-colors min-w-fit
            ${activeFilePath === file.path
              ? 'bg-terminal-bg text-white'
              : 'text-gray-400 hover:bg-terminal-bg/50'
            }
          `}
          onClick={() => onFileSelect(file.path)}
        >
          <span className="text-sm">{getFileIcon(file.path)}</span>
          <span className="text-sm">
            {getFileName(file.path)}
            {file.isDirty && <span className="text-claude-green ml-1">●</span>}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileClose(file.path);
            }}
            className="p-0.5 hover:bg-terminal-surface rounded transition-colors"
          >
            <X size={12} weight="bold" className="text-gray-500 hover:text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
