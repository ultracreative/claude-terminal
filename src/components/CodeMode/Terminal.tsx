import { useEffect } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import '@xterm/xterm/css/xterm.css';

export function Terminal() {
  const terminalId = 'terminal-container';
  const { fit } = useTerminal(terminalId);

  useEffect(() => {
    // Fit terminal after mount
    const timer = setTimeout(() => fit(), 100);
    return () => clearTimeout(timer);
  }, [fit]);

  return (
    <div className="flex-1 flex flex-col bg-terminal-bg overflow-hidden">
      <div
        id={terminalId}
        className="flex-1 w-full h-full p-4"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
