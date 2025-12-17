import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

export function useTerminal(containerId: string) {
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization - stronger check
    if (initializedRef.current || terminalRef.current) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    initializedRef.current = true;

    // Generate session ID only once
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID();
    }

    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
      theme: {
        background: '#0a0e14',
        foreground: '#e6e1dc',
        cursor: '#a78bfa',
        cursorAccent: '#0a0e14',
        selectionBackground: 'rgba(167, 139, 250, 0.3)',
        black: '#1c1e26',
        red: '#e95678',
        green: '#29d398',
        yellow: '#fab795',
        blue: '#26bbd9',
        magenta: '#ee64ac',
        cyan: '#59e3e3',
        white: '#e6e1dc',
        brightBlack: '#6c6f93',
        brightRed: '#ec6a88',
        brightGreen: '#3fdaa4',
        brightYellow: '#fbc3a7',
        brightBlue: '#3fc6de',
        brightMagenta: '#f075b5',
        brightCyan: '#6be4e4',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });

    terminalRef.current = terminal;

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    fitAddonRef.current = fitAddon;

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    // Open terminal in container
    terminal.open(container);
    fitAddon.fit();

    // Handle terminal input
    terminal.onData((data) => {
      invoke('write_to_shell', {
        sessionId: sessionIdRef.current,
        data,
      }).catch((err) => console.error('Failed to write to shell:', err));
    });

    // Listen for data from the backend
    const unlisten = listen<string>(`terminal-data-${sessionIdRef.current}`, (event) => {
      terminal.write(event.payload);
    });

    // Spawn shell
    const { cols, rows } = terminal;
    invoke('spawn_shell', {
      sessionId: sessionIdRef.current,
      cols,
      rows,
    }).catch((err) => console.error('Failed to spawn shell:', err));

    // Handle resize with ResizeObserver for full responsiveness
    const handleResize = () => {
      fitAddon.fit();
      const { cols, rows } = terminal;
      invoke('resize_terminal', {
        sessionId: sessionIdRef.current,
        cols,
        rows,
      }).catch((err) => console.error('Failed to resize terminal:', err));
    };

    // Observe container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Also handle window resize as backup
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      unlisten.then((fn) => fn());
      if (sessionIdRef.current) {
        invoke('close_session', {
          sessionId: sessionIdRef.current,
        }).catch((err) => console.error('Failed to close session:', err));
      }
      terminal.dispose();
      initializedRef.current = false;
    };
  }, [containerId]);

  return {
    terminal: terminalRef.current,
    fit: () => fitAddonRef.current?.fit(),
  };
}
