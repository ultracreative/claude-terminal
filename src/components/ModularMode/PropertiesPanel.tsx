import { Sliders, Palette as PaletteIcon } from '@phosphor-icons/react';
import type { CanvasElement } from '../../types/modular';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (element: CanvasElement) => void;
}

export function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="w-64 bg-terminal-surface border-l border-terminal-border p-4">
        <div className="text-center text-gray-500 mt-8">
          <PaletteIcon size={48} weight="duotone" className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-64 bg-terminal-surface border-l border-terminal-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-terminal-border">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Sliders size={20} weight="duotone" />
          <span>Properties</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1 capitalize">{element.type}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 terminal-scrollbar">
        {/* Position */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={Math.round(element.position.x)}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    position: { ...element.position, x: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
                placeholder="X"
              />
            </div>
            <div>
              <input
                type="number"
                value={Math.round(element.position.y)}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    position: { ...element.position, y: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
                placeholder="Y"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={Math.round(element.size.width)}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    size: { ...element.size, width: parseInt(e.target.value) || 50 },
                  })
                }
                className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
                placeholder="W"
              />
            </div>
            <div>
              <input
                type="number"
                value={Math.round(element.size.height)}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    size: { ...element.size, height: parseInt(e.target.value) || 30 },
                  })
                }
                className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
                placeholder="H"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        {(element.type === 'button' || element.type === 'text' || element.type === 'card' || element.type === 'input') && (
          <div>
            <label className="text-xs text-gray-400 block mb-2">Text</label>
            <input
              type="text"
              value={element.properties.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
              placeholder="Enter text..."
            />
          </div>
        )}

        {/* Background Color */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.properties.backgroundColor || '#34d399'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              className="w-10 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={element.properties.backgroundColor || '#34d399'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              className="flex-1 px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.properties.textColor || '#ffffff'}
              onChange={(e) => updateProperty('textColor', e.target.value)}
              className="w-10 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={element.properties.textColor || '#ffffff'}
              onChange={(e) => updateProperty('textColor', e.target.value)}
              className="flex-1 px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
            />
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Border Radius: {element.properties.borderRadius || 8}px</label>
          <input
            type="range"
            min="0"
            max="50"
            value={element.properties.borderRadius || 8}
            onChange={(e) => updateProperty('borderRadius', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Padding */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Padding: {element.properties.padding || 12}px</label>
          <input
            type="range"
            min="0"
            max="50"
            value={element.properties.padding || 12}
            onChange={(e) => updateProperty('padding', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Font Size: {element.properties.fontSize || 14}px</label>
          <input
            type="range"
            min="10"
            max="48"
            value={element.properties.fontSize || 14}
            onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Font Weight */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Font Weight</label>
          <select
            value={element.properties.fontWeight || 'normal'}
            onChange={(e) => updateProperty('fontWeight', e.target.value)}
            className="w-full px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-sm text-white"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>
    </div>
  );
}
