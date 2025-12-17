export type AllowanceStage =
  | 'allow'
  | 'create'
  | 'control'
  | 'calibrate'
  | 'place'
  | 'adjust'
  | 'feature';

export interface StageInfo {
  id: AllowanceStage;
  number: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const ALLOWANCE_STAGES: StageInfo[] = [
  {
    id: 'allow',
    number: 1,
    name: 'ALLOW',
    description: 'Grant permission & establish possibility',
    icon: '🎯',
    color: '#10b981',
  },
  {
    id: 'create',
    number: 2,
    name: 'CREATE',
    description: 'Generate the element or behavior',
    icon: '✨',
    color: '#34d399',
  },
  {
    id: 'control',
    number: 3,
    name: 'CONTROL',
    description: 'Define parameters & constraints',
    icon: '⚙️',
    color: '#6ee7b7',
  },
  {
    id: 'calibrate',
    number: 4,
    name: 'CALIBRATE',
    description: 'Fine-tune the behavior',
    icon: '🎚️',
    color: '#6ee7b7',
  },
  {
    id: 'place',
    number: 5,
    name: 'PLACE',
    description: 'Position in space/context',
    icon: '📍',
    color: '#34d399',
  },
  {
    id: 'adjust',
    number: 6,
    name: 'ADJUST',
    description: 'Refine the positioning',
    icon: '🔧',
    color: '#10b981',
  },
  {
    id: 'feature',
    number: 7,
    name: 'FEATURE',
    description: 'Lock in as production code',
    icon: '🔒',
    color: '#059669',
  },
];

export interface CanvasElement {
  id: string;
  type: 'button' | 'container' | 'text' | 'image' | 'input' | 'card';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: {
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
    fontWeight?: string;
    imageUrl?: string;
    children?: string[]; // IDs of child elements for containers
    [key: string]: any;
  };
  stage: AllowanceStage;
  zIndex: number;
}
