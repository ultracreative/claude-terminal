use anyhow::Result;
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter, Manager};

pub struct TerminalManager {
    sessions: Arc<Mutex<HashMap<String, TerminalSession>>>,
}

struct TerminalSession {
    writer: Box<dyn Write + Send>,
    _reader_handle: std::thread::JoinHandle<()>,
}

impl TerminalManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn spawn_shell(
        &self,
        session_id: String,
        cols: u16,
        rows: u16,
        app_handle: AppHandle,
    ) -> Result<()> {
        let pty_system = NativePtySystem::default();

        let pair = pty_system.openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })?;

        // Determine the shell to use
        let shell = if cfg!(target_os = "windows") {
            "powershell.exe".to_string()
        } else {
            std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string())
        };

        let mut cmd = CommandBuilder::new(shell);
        cmd.env("TERM", "xterm-256color");

        let mut child = pair.slave.spawn_command(cmd)?;

        // Drop the slave side as we don't need it anymore
        drop(pair.slave);

        let mut reader = pair.master.try_clone_reader()?;
        let writer = pair.master.take_writer()?;

        // Spawn a thread to read from the PTY and send data to the frontend
        let session_id_clone = session_id.clone();
        let reader_handle = std::thread::spawn(move || {
            let mut buf = [0u8; 8192];
            loop {
                match reader.read(&mut buf) {
                    Ok(0) => break, // EOF
                    Ok(n) => {
                        let data = String::from_utf8_lossy(&buf[..n]).to_string();
                        let _ = app_handle.emit(&format!("terminal-data-{}", session_id_clone), data);
                    }
                    Err(_) => break,
                }
            }
        });

        // Store the session
        let session = TerminalSession {
            writer,
            _reader_handle: reader_handle,
        };

        self.sessions.lock().unwrap().insert(session_id, session);

        // Spawn a thread to wait for the child process
        std::thread::spawn(move || {
            let _ = child.wait();
        });

        Ok(())
    }

    pub fn write_to_shell(&self, session_id: &str, data: &str) -> Result<()> {
        let mut sessions = self.sessions.lock().unwrap();

        if let Some(session) = sessions.get_mut(session_id) {
            session.writer.write_all(data.as_bytes())?;
            session.writer.flush()?;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Session not found"))
        }
    }

    pub fn resize(&self, session_id: &str, cols: u16, rows: u16) -> Result<()> {
        // Note: portable-pty doesn't expose resize after creation
        // This is a limitation we'd need to work around with a different approach
        // For now, we'll just log it
        log::info!("Resize requested for session {}: {}x{}", session_id, cols, rows);
        Ok(())
    }

    pub fn close_session(&self, session_id: &str) -> Result<()> {
        let mut sessions = self.sessions.lock().unwrap();
        sessions.remove(session_id);
        Ok(())
    }
}
