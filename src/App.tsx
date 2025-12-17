import { useEffect } from 'react';
import { Header } from './components/shared/Header';
import { CodeMode } from './components/CodeMode/CodeMode';
import { EditorMode } from './components/EditorMode/EditorMode';
import { ModularMode } from './components/ModularMode/ModularMode';
import { useAppStore } from './store/appStore';

function App() {
  const { mode, setMode } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + T for Terminal
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setMode('terminal');
      }
      // Cmd/Ctrl + Shift + E for Editor
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setMode('editor');
      }
      // Cmd/Ctrl + Shift + M for Modular
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setMode('modular');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  const renderMode = () => {
    switch (mode) {
      case 'terminal':
        return <CodeMode />;
      case 'editor':
        return <EditorMode />;
      case 'modular':
        return <ModularMode />;
      default:
        return <CodeMode />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header />
      {renderMode()}
    </div>
  );
}

export default App;
