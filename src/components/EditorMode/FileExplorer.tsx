import { useState, useEffect } from 'react';
import { Folder, FolderOpen, File, CaretRight, CaretDown, FolderOpen as FolderOpenIcon } from '@phosphor-icons/react';
import { invoke } from '@tauri-apps/api/core';

interface FileExplorerProps {
  onFileOpen: (path: string, content: string, language: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  is_directory: boolean;
  children?: FileNode[];
}

export function FileExplorer({ onFileOpen }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [rootPath, setRootPath] = useState<string>('');

  useEffect(() => {
    // Load the current working directory
    // For now, we'll use a default path or wait for user to open a folder
    const defaultPath = '/Users/danrodriguez/Desktop/Claude-Terminal/claude-terminal';
    loadDirectory(defaultPath);
  }, []);

  const loadDirectory = async (path: string) => {
    try {
      const fileTree = await invoke<FileNode[]>('read_directory', { path });
      setFiles(fileTree);
      setRootPath(path);
    } catch (error) {
      console.error('Failed to load directory:', error);
      // Fallback to empty state
      setFiles([]);
      setRootPath('');
    }
  };

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const handleFileClick = async (node: FileNode) => {
    if (node.is_directory) {
      toggleDirectory(node.path);
      return;
    }

    try {
      const content = await invoke<string>('read_file', { path: node.path });
      const language = getLanguageFromPath(node.path);
      onFileOpen(node.path, content, language);
    } catch (error) {
      console.error('Failed to open file:', error);
      // Fallback to empty content
      const language = getLanguageFromPath(node.path);
      onFileOpen(node.path, `// Failed to load file: ${error}`, language);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      case 'rs':
        return 'rust';
      case 'py':
        return 'python';
      default:
        return 'plaintext';
    }
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

  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedDirs.has(node.path);

    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-1 px-2 py-1 hover:bg-terminal-bg cursor-pointer transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
          onClick={() => handleFileClick(node)}
        >
          {node.is_directory ? (
            <>
              {isExpanded ? (
                <CaretDown size={12} weight="bold" className="text-gray-400" />
              ) : (
                <CaretRight size={12} weight="bold" className="text-gray-400" />
              )}
              {isExpanded ? (
                <FolderOpen size={16} weight="fill" className="text-blue-400" />
              ) : (
                <Folder size={16} weight="fill" className="text-blue-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-[12px]" />
              <span className="text-sm">{getFileIcon(node.path)}</span>
            </>
          )}
          <span className="text-sm text-gray-300">{node.name}</span>
        </div>

        {node.is_directory && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-terminal-surface border-r border-terminal-border flex flex-col overflow-hidden">
      <div className="p-3 border-b border-terminal-border">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <File size={16} weight="duotone" />
          <span>Explorer</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1 truncate" title={rootPath}>
          {rootPath || 'No folder open'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto terminal-scrollbar">
        {files.length > 0 ? (
          files.map(node => renderNode(node))
        ) : (
          <div className="text-center text-gray-500 p-4 text-sm">
            <p>No files</p>
            <p className="text-xs mt-2">Open a folder to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
