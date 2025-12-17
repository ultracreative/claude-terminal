import { useRef, type MouseEvent } from 'react';
import { X } from '@phosphor-icons/react';
import type { CanvasElement } from '../../types/modular';

interface DraggableElementProps {
  element: CanvasElement;
  onUpdate: (element: CanvasElement) => void;
  onDelete: (id: string) => void;
  onSelect: (element: CanvasElement) => void;
  isSelected: boolean;
}

export function DraggableElement({
  element,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
}: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;

    e.stopPropagation();

    // Select element immediately on mouse down
    onSelect(element);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = element.position.x;
    const startPosY = element.position.y;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Check if mouse has moved more than 3px (threshold for drag vs click)
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        const newX = startPosX + deltaX;
        const newY = startPosY + deltaY;

        onUpdate({
          ...element,
          position: { x: Math.max(0, newX), y: Math.max(0, newY) },
        });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResize = (e: MouseEvent, direction: 'se' | 'ne' | 'sw' | 'nw') => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size.width;
    const startHeight = element.size.height;
    const startPosX = element.position.x;
    const startPosY = element.position.y;

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('e')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (direction.includes('w')) {
        const candidateWidth = startWidth - deltaX;
        if (candidateWidth >= 50) {
          newWidth = candidateWidth;
          newX = startPosX + deltaX;
        } else {
          newWidth = 50;
          newX = startPosX + startWidth - 50;
        }
      }
      if (direction.includes('s')) {
        newHeight = Math.max(30, startHeight + deltaY);
      }
      if (direction.includes('n')) {
        const candidateHeight = startHeight - deltaY;
        if (candidateHeight >= 30) {
          newHeight = candidateHeight;
          newY = startPosY + deltaY;
        } else {
          newHeight = 30;
          newY = startPosY + startHeight - 30;
        }
      }

      onUpdate({
        ...element,
        size: { width: newWidth, height: newHeight },
        position: { x: Math.max(0, newX), y: Math.max(0, newY) },
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const renderElement = () => {
    const baseStyle = {
      backgroundColor: element.properties.backgroundColor || '#34d399',
      color: element.properties.textColor || '#ffffff',
      borderRadius: `${element.properties.borderRadius || 8}px`,
      padding: `${element.properties.padding || 12}px`,
      fontSize: `${element.properties.fontSize || 14}px`,
      fontWeight: element.properties.fontWeight || 'normal',
    };

    switch (element.type) {
      case 'button':
        return (
          <button
            className="w-full h-full cursor-move hover:opacity-90 transition-opacity"
            style={baseStyle}
          >
            {element.properties.text || 'Button'}
          </button>
        );

      case 'text':
        return (
          <div
            className="w-full h-full cursor-move"
            style={{ ...baseStyle, backgroundColor: 'transparent' }}
          >
            {element.properties.text || 'Text'}
          </div>
        );

      case 'container':
        return (
          <div
            className="w-full h-full cursor-move border-2 border-dashed"
            style={{
              ...baseStyle,
              backgroundColor: element.properties.backgroundColor || 'rgba(52, 211, 153, 0.1)',
              borderColor: '#34d399',
            }}
          >
            <div className="text-xs text-gray-400 mb-2">Container</div>
          </div>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={element.properties.text || 'Input field'}
            className="w-full h-full cursor-move px-3"
            style={baseStyle}
            readOnly
          />
        );

      case 'card':
        return (
          <div
            className="w-full h-full cursor-move shadow-lg"
            style={baseStyle}
          >
            <div className="font-semibold mb-2">{element.properties.text || 'Card Title'}</div>
            <div className="text-sm opacity-80">Card content goes here</div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full cursor-move" style={baseStyle}>
            {element.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-claude-green' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {renderElement()}

      {isSelected && (
        <>
          {/* Resize handles */}
          <div
            className="resize-handle absolute -bottom-1 -right-1 w-4 h-4 bg-claude-green rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResize(e, 'se')}
          />
          <div
            className="resize-handle absolute -top-1 -right-1 w-4 h-4 bg-claude-green rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResize(e, 'ne')}
          />
          <div
            className="resize-handle absolute -bottom-1 -left-1 w-4 h-4 bg-claude-green rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResize(e, 'sw')}
          />
          <div
            className="resize-handle absolute -top-1 -left-1 w-4 h-4 bg-claude-green rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResize(e, 'nw')}
          />

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={14} weight="bold" className="text-white" />
          </button>
        </>
      )}
    </div>
  );
}
