import { useEffect } from 'react';
import { type CanvasElement } from '../../types/modular';
import { Palette, MagnifyingGlassMinus, MagnifyingGlassPlus, Sliders, ChatCircle } from '@phosphor-icons/react';
import { DraggableElement } from './DraggableElement';

interface CanvasProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onElementUpdate: (element: CanvasElement) => void;
  onElementDelete: (id: string) => void;
  onElementSelect: (element: CanvasElement | null) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showProperties: boolean;
  onToggleProperties: () => void;
  showConversation: boolean;
  onToggleConversation: () => void;
}

export function Canvas({
  elements,
  selectedElement,
  onElementUpdate,
  onElementDelete,
  onElementSelect,
  zoom,
  onZoomChange,
  showProperties,
  onToggleProperties,
  showConversation,
  onToggleConversation,
}: CanvasProps) {
  if (elements.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-terminal-bg to-terminal-surface">
        <div className="text-center space-y-4 text-gray-500">
          <div className="flex justify-center opacity-20">
            <Palette size={64} weight="duotone" />
          </div>
          <p className="text-sm">Your creations will appear here</p>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 10, 25));
  };

  const handleResetZoom = () => {
    onZoomChange(100);
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  return (
    <div className="flex-1 relative bg-gradient-to-br from-terminal-bg to-terminal-surface overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #34d399 1px, transparent 1px),
            linear-gradient(to bottom, #34d399 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-terminal-surface border border-terminal-border rounded-lg p-1">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-terminal-bg rounded transition-colors"
            title="Zoom Out"
          >
            <MagnifyingGlassMinus size={18} weight="duotone" className="text-gray-400" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-2 hover:bg-terminal-bg rounded transition-colors text-xs text-gray-400 min-w-[50px]"
            title="Reset Zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-terminal-bg rounded transition-colors"
            title="Zoom In"
          >
            <MagnifyingGlassPlus size={18} weight="duotone" className="text-gray-400" />
          </button>
        </div>

        {/* Panel toggles */}
        <div className="flex items-center gap-1 bg-terminal-surface border border-terminal-border rounded-lg p-1">
          <button
            onClick={onToggleProperties}
            className={`p-2 rounded transition-colors ${showProperties ? 'bg-claude-green/20 text-claude-green' : 'hover:bg-terminal-bg text-gray-400'}`}
            title="Toggle Properties Panel"
          >
            <Sliders size={18} weight="duotone" />
          </button>
          <button
            onClick={onToggleConversation}
            className={`p-2 rounded transition-colors ${showConversation ? 'bg-claude-green/20 text-claude-green' : 'hover:bg-terminal-bg text-gray-400'}`}
            title="Toggle Conversation Panel"
          >
            <ChatCircle size={18} weight="duotone" />
          </button>
        </div>
      </div>

      {/* Canvas elements with zoom */}
      <div
        className="relative w-full h-full p-8 overflow-auto"
        onClick={() => onElementSelect(null)}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            width: `${10000 / (zoom / 100)}px`,
            height: `${10000 / (zoom / 100)}px`,
          }}
        >
          {elements
            .filter((element) => element.properties.visible !== false)
            .map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                onUpdate={onElementUpdate}
                onDelete={onElementDelete}
                onSelect={onElementSelect}
                isSelected={selectedElement?.id === element.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
