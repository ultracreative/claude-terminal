import { ALLOWANCE_STAGES, type AllowanceStage } from '../../types/modular';

interface StageIndicatorProps {
  currentStage: AllowanceStage;
  onStageClick: (stage: AllowanceStage) => void;
}

export function StageIndicator({ currentStage, onStageClick }: StageIndicatorProps) {
  const currentStageIndex = ALLOWANCE_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="flex items-center gap-2 p-4 bg-terminal-surface border-b border-terminal-border overflow-x-auto">
      {ALLOWANCE_STAGES.map((stage, index) => {
        const isActive = stage.id === currentStage;
        const isCompleted = index < currentStageIndex;
        const isAccessible = index <= currentStageIndex + 1;

        return (
          <div key={stage.id} className="flex items-center gap-2">
            <button
              onClick={() => isAccessible && onStageClick(stage.id)}
              disabled={!isAccessible}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all
                ${isActive
                  ? 'bg-claude-green shadow-lg shadow-claude-green/20 scale-105'
                  : isCompleted
                  ? 'bg-claude-green/20 hover:bg-claude-green/30'
                  : isAccessible
                  ? 'bg-terminal-bg hover:bg-terminal-surface'
                  : 'bg-terminal-bg opacity-40 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stage.icon}</span>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-xs font-bold
                      ${isActive ? 'text-white' : 'text-gray-400'}
                    `}>
                      {stage.number}
                    </span>
                    <span className={`
                      text-sm font-bold
                      ${isActive ? 'text-white' : 'text-gray-300'}
                    `}>
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 text-left max-w-32">
                    {stage.description}
                  </span>
                </div>
              </div>
            </button>

            {index < ALLOWANCE_STAGES.length - 1 && (
              <div className={`
                w-8 h-0.5
                ${isCompleted ? 'bg-claude-green' : 'bg-terminal-border'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}
