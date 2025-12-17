use crate::terminal::TerminalManager;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn spawn_shell(
    session_id: String,
    cols: u16,
    rows: u16,
    terminal_manager: State<'_, TerminalManager>,
    app_handle: AppHandle,
) -> Result<(), String> {
    terminal_manager
        .spawn_shell(session_id, cols, rows, app_handle)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_to_shell(
    session_id: String,
    data: String,
    terminal_manager: State<'_, TerminalManager>,
) -> Result<(), String> {
    terminal_manager
        .write_to_shell(&session_id, &data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn resize_terminal(
    session_id: String,
    cols: u16,
    rows: u16,
    terminal_manager: State<'_, TerminalManager>,
) -> Result<(), String> {
    terminal_manager
        .resize(&session_id, cols, rows)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn close_session(
    session_id: String,
    terminal_manager: State<'_, TerminalManager>,
) -> Result<(), String> {
    terminal_manager
        .close_session(&session_id)
        .map_err(|e| e.to_string())
}
