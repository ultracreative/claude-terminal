import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { invoke } from '@tauri-apps/api/core';
import { FileExplorer } from './FileExplorer';
import { FileTabs } from './FileTabs';
import { Toolbar } from './Toolbar';
import { AIChatPanel } from './AIChatPanel';
import { claudeClient, type ClaudeMessage } from '../../lib/claude';
import { useAppStore } from '../../store/appStore';

export interface OpenFile {
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export function EditorMode() {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiMessages, setAiMessages] = useState<ClaudeMessage[]>([]);
  const { isLoading, setLoading } = useAppStore();

  const activeFile = openFiles.find(f => f.path === activeFilePath);

  const handleFileOpen = (path: string, content: string, language: string) => {
    // Check if file is already open
    const existingFile = openFiles.find(f => f.path === path);
    if (existingFile) {
      setActiveFilePath(path);
      return;
    }

    // Add new file to open files
    const newFile: OpenFile = { path, content, language, isDirty: false };
    setOpenFiles([...openFiles, newFile]);
    setActiveFilePath(path);
  };

  const handleFileClose = (path: string) => {
    const updatedFiles = openFiles.filter(f => f.path !== path);
    setOpenFiles(updatedFiles);

    if (activeFilePath === path) {
      setActiveFilePath(updatedFiles.length > 0 ? updatedFiles[0].path : null);
    }
  };

  const handleContentChange = (value: string | undefined) => {
    if (!activeFilePath || value === undefined) return;

    setOpenFiles(openFiles.map(f =>
      f.path === activeFilePath
        ? { ...f, content: value, isDirty: true }
        : f
    ));
  };

  const handleFileSave = async (path: string) => {
    const file = openFiles.find(f => f.path === path);
    if (!file) return;

    try {
      await invoke('write_file', { path, contents: file.content });
      console.log('File saved successfully:', path);

      setOpenFiles(openFiles.map(f =>
        f.path === path ? { ...f, isDirty: false } : f
      ));
    } catch (error) {
      console.error('Failed to save file:', error);
      alert(`Failed to save file: ${error}`);
    }
  };

  const handleAIMessage = async (userMessage: string) => {
    setLoading(true);

    // Build context-aware prompt if there's an active file
    let contextPrompt = userMessage;
    if (activeFile) {
      contextPrompt = `I'm working on a file: ${activeFile.path}

File content:
\`\`\`${activeFile.language}
${activeFile.content}
\`\`\`

${userMessage}`;
    }

    const newUserMessage: ClaudeMessage = { role: 'user', content: contextPrompt };
    const updatedMessages = [...aiMessages, newUserMessage];
    setAiMessages(updatedMessages);

    try {
      const response = await claudeClient.sendMessage(updatedMessages, 'editor');
      const assistantMessage: ClaudeMessage = { role: 'assistant', content: response };
      setAiMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ClaudeMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error}`,
      };
      setAiMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S / Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeFilePath) {
          handleFileSave(activeFilePath);
        }
      }
      // Cmd+K / Ctrl+K to toggle AI panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowAIPanel(!showAIPanel);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFilePath, openFiles, showAIPanel]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-terminal-bg">
      <Toolbar
        showFileExplorer={showFileExplorer}
        onToggleFileExplorer={() => setShowFileExplorer(!showFileExplorer)}
        showAIPanel={showAIPanel}
        onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
        activeFile={activeFile}
        onSave={activeFile ? () => handleFileSave(activeFile.path) : undefined}
      />

      <div className="flex-1 flex overflow-hidden">
        {showFileExplorer && (
          <FileExplorer
            onFileOpen={handleFileOpen}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <FileTabs
            files={openFiles}
            activeFilePath={activeFilePath}
            onFileSelect={setActiveFilePath}
            onFileClose={handleFileClose}
            onFileSave={handleFileSave}
          />

          <div className="flex-1 overflow-hidden">
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={handleContentChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No file open</p>
                  <p className="text-sm">Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showAIPanel && (
          <AIChatPanel
            messages={aiMessages}
            onSendMessage={handleAIMessage}
            isLoading={isLoading}
            currentFile={activeFile ? {
              path: activeFile.path,
              content: activeFile.content,
              language: activeFile.language,
            } : null}
          />
        )}
      </div>
    </div>
  );
}
