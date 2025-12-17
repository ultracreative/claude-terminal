import React, { useState } from 'react';
import { Stack, Eye, EyeSlash, DotsSixVertical, CaretRight, CaretDown } from '@phosphor-icons/react';
import type { CanvasElement } from '../../types/modular';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onElementSelect: (element: CanvasElement) => void;
  onElementUpdate: (element: CanvasElement) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onNestElement: (childId: string, parentId: string) => void;
  onUnnestElement: (childId: string, parentId: string) => void;
}

export function LayersPanel({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onReorder,
  onNestElement,
}: LayersPanelProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Build hierarchy: separate parent and child elements
  const getHierarchy = () => {
    const childIds = new Set<string>();
    elements.forEach(el => {
      if (el.properties.children) {
        el.properties.children.forEach(childId => childIds.add(childId));
      }
    });

    // Top-level elements (not children of any other element)
    const topLevel = elements.filter(el => !childIds.has(el.id));

    // Sort by z-index (highest first)
    return topLevel.sort((a, b) => b.zIndex - a.zIndex);
  };

  const getChildren = (parentId: string): CanvasElement[] => {
    const parent = elements.find(el => el.id === parentId);
    if (!parent || !parent.properties.children) return [];

    return parent.properties.children
      .map(childId => elements.find(el => el.id === childId))
      .filter((el): el is CanvasElement => el !== undefined)
      .sort((a, b) => b.zIndex - a.zIndex);
  };

  const toggleExpanded = (elementId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(elementId)) {
      newExpanded.delete(elementId);
    } else {
      newExpanded.add(elementId);
    }
    setExpandedIds(newExpanded);
  };

  const sortedElements = getHierarchy();

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    // Only drag from the handle icon
    const target = e.target as HTMLElement;
    const isDragHandle = target.closest('.drag-handle');

    if (!isDragHandle) return;

    e.stopPropagation();
    e.preventDefault();

    let currentDraggedId = elementId;
    let currentDragOverId: string | null = null;
    let hasMoved = false;

    setDraggedId(elementId);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      hasMoved = true;

      // Find which element we're hovering over
      const elementsAtPoint = document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
      const layerItem = elementsAtPoint.find(el => el.classList.contains('layer-item'));

      if (layerItem) {
        const hoveredId = layerItem.getAttribute('data-element-id');
        if (hoveredId && hoveredId !== currentDraggedId) {
          currentDragOverId = hoveredId;
          setDragOverId(hoveredId);
        }
      } else {
        setDragOverId(null);
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (currentDragOverId && currentDraggedId && currentDragOverId !== currentDraggedId && hasMoved) {
        const targetElement = elements.find(el => el.id === currentDragOverId);
        const draggedElement = elements.find(el => el.id === currentDraggedId);

        // Check if Shift key is held to nest into container
        if (upEvent.shiftKey && targetElement && targetElement.type === 'container' && draggedElement && currentDragOverId) {
          // Nest the dragged element into the container
          const targetIdToNest = currentDragOverId;
          onNestElement(currentDraggedId, targetIdToNest);
          // Auto-expand the parent to show the new child
          setExpandedIds(prev => new Set([...prev, targetIdToNest]));
        } else if (currentDraggedId && currentDragOverId) {
          // Normal reordering
          onReorder(currentDraggedId, currentDragOverId);
        }
      }

      setDraggedId(null);
      setDragOverId(null);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const toggleVisibility = (element: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    onElementUpdate({
      ...element,
      properties: {
        ...element.properties,
        visible: element.properties.visible === false ? true : false,
      },
    });
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'button':
        return '🔘';
      case 'text':
        return 'T';
      case 'container':
        return '□';
      case 'card':
        return '▭';
      case 'input':
        return '⎯';
      default:
        return '■';
    }
  };

  const getElementLabel = (element: CanvasElement) => {
    if (element.properties.text) {
      return element.properties.text.substring(0, 20) + (element.properties.text.length > 20 ? '...' : '');
    }
    return element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  if (elements.length === 0) {
    return (
      <div className="w-64 bg-terminal-surface border-r border-terminal-border p-4">
        <div className="text-center text-gray-500 mt-8">
          <Stack size={48} weight="duotone" className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No layers yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-terminal-surface border-r border-terminal-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-terminal-border">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Stack size={20} weight="duotone" />
          <span>Layers</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">{elements.length} element{elements.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 overflow-y-auto terminal-scrollbar">
        {sortedElements.map((element) => renderLayerItem(element, 0))}
      </div>
    </div>
  );

  function renderLayerItem(element: CanvasElement, depth: number): React.ReactNode {
    const isSelected = selectedElement?.id === element.id;
    const isVisible = element.properties.visible !== false;
    const isLayerDragging = draggedId === element.id;
    const isLayerDragOver = dragOverId === element.id;
    const children = getChildren(element.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(element.id);

    return (
      <React.Fragment key={element.id}>
        <div
          data-element-id={element.id}
          className={`
            layer-item
            flex items-center gap-2 px-3 py-2 border-b border-terminal-border
            transition-all duration-200 ease-out
            ${isSelected ? 'bg-claude-green/20 border-l-2 border-l-claude-green' : 'hover:bg-terminal-bg/50'}
            ${isLayerDragOver ? 'border-t-4 border-t-claude-green bg-claude-green/10 scale-105' : 'border-t border-t-transparent'}
            ${isLayerDragging ? 'scale-95 shadow-lg' : ''}
            ${!isVisible ? 'opacity-50' : ''}
          `}
          style={{
            opacity: isLayerDragging ? 0.5 : 1,
            paddingLeft: `${12 + depth * 16}px`,
          }}
        >
          {/* Expand/collapse button for containers with children */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(element.id)}
              className="p-0.5 hover:bg-terminal-bg rounded"
            >
              {isExpanded ? (
                <CaretDown size={12} weight="bold" className="text-gray-400" />
              ) : (
                <CaretRight size={12} weight="bold" className="text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-[13px]" />
          )}

          <div
            className="drag-handle"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <DotsSixVertical size={16} weight="bold" className="text-gray-400 hover:text-claude-green cursor-grab active:cursor-grabbing" />
          </div>

          <div
            className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
            onClick={() => onElementSelect(element)}
          >
            <span className="text-sm">{getElementIcon(element.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{getElementLabel(element)}</div>
              <div className="text-xs text-gray-500 capitalize">
                {element.type}
                {hasChildren && <span className="ml-1">({children.length})</span>}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => toggleVisibility(element, e)}
            className="p-1 hover:bg-terminal-bg rounded transition-colors"
          >
            {isVisible ? (
              <Eye size={16} weight="duotone" className="text-gray-400" />
            ) : (
              <EyeSlash size={16} weight="duotone" className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && children.map(child => renderLayerItem(child, depth + 1))}
      </React.Fragment>
    );
  }
}
