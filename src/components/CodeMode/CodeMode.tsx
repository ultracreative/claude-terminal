import { Terminal } from './Terminal';

export function CodeMode() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Terminal />
    </div>
  );
}
