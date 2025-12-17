import { Sparkle, PaintBrush, Cube, Lightning, Palette } from '@phosphor-icons/react';

interface ExampleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

const EXAMPLES: ExampleCard[] = [
  {
    title: 'Create a Button',
    description: 'Design an interactive button with custom styling',
    icon: <Cube size={24} weight="duotone" />,
    prompt: 'I want to create a button',
  },
  {
    title: 'Build a Form',
    description: 'Generate a contact form with validation',
    icon: <PaintBrush size={24} weight="duotone" />,
    prompt: 'Help me build a contact form',
  },
  {
    title: 'Design a Card',
    description: 'Make a product card with image and text',
    icon: <Sparkle size={24} weight="duotone" />,
    prompt: 'Design a product card for me',
  },
  {
    title: 'Animate Element',
    description: 'Add smooth animations to any element',
    icon: <Lightning size={24} weight="duotone" />,
    prompt: 'Add animation to my element',
  },
];

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void;
}

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-terminal-bg to-terminal-surface">
      <div className="max-w-4xl w-full space-y-6 md:space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Palette size={64} weight="duotone" className="text-claude-green" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-claude-green-light to-claude-green bg-clip-text text-transparent">
            Claude Modular
          </h1>
          <p className="text-xl text-gray-300">
            Visual AI-powered creation with Allowance Control
          </p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Transform your ideas into reality through a guided 7-stage process.
            From permission to production, Claude helps you build with precision and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {EXAMPLES.map((example) => (
            <button
              key={example.title}
              onClick={() => onExampleClick(example.prompt)}
              className="
                group p-6 rounded-xl bg-terminal-surface border border-terminal-border
                hover:border-claude-green hover:bg-terminal-surface/80
                transition-all duration-200 text-left
              "
            >
              <div className="flex items-start gap-4">
                <div className="
                  p-3 rounded-lg bg-claude-green/10 text-claude-green
                  group-hover:bg-claude-green group-hover:text-white
                  transition-all duration-200
                ">
                  {example.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {example.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Or start by typing what you want to create below
          </p>
        </div>
      </div>
    </div>
  );
}
