import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { Canvas } from './Canvas';
import { InputArea } from './InputArea';
import { ConversationPanel } from './ConversationPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { useAppStore } from '../../store/appStore';
import { claudeClient, type ClaudeMessage } from '../../lib/claude';
import type { AllowanceStage, CanvasElement } from '../../types/modular';

export function ModularMode() {
  const [currentStage] = useState<AllowanceStage>('allow');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [conversation, setConversation] = useState<ClaudeMessage[]>([]);
  const [showProperties, setShowProperties] = useState(true);
  const [showConversation, setShowConversation] = useState(true);
  const [zoom, setZoom] = useState(100);
  const { isLoading, setLoading } = useAppStore();

  const handleExampleClick = (prompt: string) => {
    setShowWelcome(false);
    handleSubmit(prompt);
  };

  const handleSubmit = async (message: string) => {
    // Hide welcome screen when user submits first message
    if (showWelcome) {
      setShowWelcome(false);
    }

    setLoading(true);

    // Add user message to conversation
    const userMessage: ClaudeMessage = { role: 'user', content: message };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);

    try {
      // Get Claude's response
      const response = await claudeClient.sendMessage(newConversation, 'modular');

      // Add assistant message to conversation
      const assistantMessage: ClaudeMessage = { role: 'assistant', content: response };
      setConversation([...newConversation, assistantMessage]);

      // Create a visual element on canvas when appropriate
      if (currentStage === 'create' || message.toLowerCase().includes('create') || message.toLowerCase().includes('button') || message.toLowerCase().includes('container')) {
        const elementType = message.toLowerCase().includes('button')
          ? 'button'
          : message.toLowerCase().includes('container')
          ? 'container'
          : message.toLowerCase().includes('card')
          ? 'card'
          : message.toLowerCase().includes('input')
          ? 'input'
          : message.toLowerCase().includes('text')
          ? 'text'
          : 'button';

        const newElement: CanvasElement = {
          id: crypto.randomUUID(),
          type: elementType,
          position: {
            x: Math.random() * 300 + 50,
            y: Math.random() * 200 + 50,
          },
          size: {
            width: elementType === 'container' ? 300 : elementType === 'card' ? 250 : 120,
            height: elementType === 'container' ? 200 : elementType === 'card' ? 150 : 40,
          },
          properties: {
            text: elementType === 'button' ? 'Button' : elementType === 'text' ? 'Text' : message.length > 30 ? 'Element' : message,
            backgroundColor: '#34d399',
            textColor: '#ffffff',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            fontWeight: 'normal',
          },
          stage: currentStage,
          zIndex: elements.length + 1,
        };

        setElements([...elements, newElement]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to get Claude response:', error);
      setLoading(false);
    }
  };

  const handleElementUpdate = (updatedElement: CanvasElement) => {
    // Find the old element to calculate position delta
    const oldElement = elements.find(el => el.id === updatedElement.id);

    // Update the element
    let updatedElements = elements.map((el) => (el.id === updatedElement.id ? updatedElement : el));

    // If this element moved and has children, move all children by the same delta
    if (oldElement && updatedElement.properties.children) {
      const deltaX = updatedElement.position.x - oldElement.position.x;
      const deltaY = updatedElement.position.y - oldElement.position.y;

      if (deltaX !== 0 || deltaY !== 0) {
        // Recursively move all children
        const moveChildren = (childIds: string[]) => {
          childIds.forEach(childId => {
            updatedElements = updatedElements.map(el => {
              if (el.id === childId) {
                const movedChild = {
                  ...el,
                  position: {
                    x: el.position.x + deltaX,
                    y: el.position.y + deltaY,
                  },
                };
                // Recursively move this child's children
                if (movedChild.properties.children) {
                  moveChildren(movedChild.properties.children);
                }
                return movedChild;
              }
              return el;
            });
          });
        };

        moveChildren(updatedElement.properties.children);
      }
    }

    setElements(updatedElements);

    if (selectedElement?.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  };

  const handleElementDelete = (id: string) => {
    // Find all descendant IDs to delete (recursively)
    const getDescendantIds = (elementId: string): string[] => {
      const element = elements.find(el => el.id === elementId);
      if (!element || !element.properties.children) return [];

      const descendants: string[] = [];
      element.properties.children.forEach(childId => {
        descendants.push(childId);
        descendants.push(...getDescendantIds(childId));
      });
      return descendants;
    };

    const idsToDelete = [id, ...getDescendantIds(id)];

    setElements(elements.filter((el) => !idsToDelete.includes(el.id)));

    if (selectedElement && idsToDelete.includes(selectedElement.id)) {
      setSelectedElement(null);
    }
  };

  const handleElementSelect = (element: CanvasElement | null) => {
    setSelectedElement(element);
  };

  const handleReorder = (draggedId: string, targetId: string) => {
    // Sort elements by current z-index
    const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

    // Find indices
    const draggedIndex = sorted.findIndex(el => el.id === draggedId);
    const targetIndex = sorted.findIndex(el => el.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged element and insert at target position
    const [draggedElement] = sorted.splice(draggedIndex, 1);
    sorted.splice(targetIndex, 0, draggedElement);

    // Reassign z-indices based on new order (highest first)
    const reordered = sorted.map((el, index) => ({
      ...el,
      zIndex: sorted.length - index,
    }));

    setElements(reordered);
  };

  const handleNestElement = (childId: string, parentId: string) => {
    setElements(elements.map(el => {
      if (el.id === parentId) {
        // Add child to parent's children array
        const currentChildren = el.properties.children || [];
        if (!currentChildren.includes(childId)) {
          return {
            ...el,
            properties: {
              ...el.properties,
              children: [...currentChildren, childId],
            },
          };
        }
      }
      return el;
    }));
  };

  const handleUnnestElement = (childId: string, parentId: string) => {
    setElements(elements.map(el => {
      if (el.id === parentId && el.properties.children) {
        // Remove child from parent's children array
        return {
          ...el,
          properties: {
            ...el.properties,
            children: el.properties.children.filter(id => id !== childId),
          },
        };
      }
      return el;
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen onExampleClick={handleExampleClick} />
        ) : (
          <>
            <LayersPanel
              elements={elements}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onElementUpdate={handleElementUpdate}
              onReorder={handleReorder}
              onNestElement={handleNestElement}
              onUnnestElement={handleUnnestElement}
            />
            <Canvas
              elements={elements}
              selectedElement={selectedElement}
              onElementUpdate={handleElementUpdate}
              onElementDelete={handleElementDelete}
              onElementSelect={handleElementSelect}
              zoom={zoom}
              onZoomChange={setZoom}
              showProperties={showProperties}
              onToggleProperties={() => setShowProperties(!showProperties)}
              showConversation={showConversation}
              onToggleConversation={() => setShowConversation(!showConversation)}
            />
            {showProperties && <PropertiesPanel element={selectedElement} onUpdate={handleElementUpdate} />}
            {showConversation && conversation.length > 0 && <ConversationPanel messages={conversation} />}
          </>
        )}
      </div>

      <InputArea
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder={
          showWelcome
            ? "What would you like to create?"
            : "What's next?"
        }
      />
    </div>
  );
}
