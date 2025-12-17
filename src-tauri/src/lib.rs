mod commands;
mod terminal;
mod filesystem;

use terminal::TerminalManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .manage(TerminalManager::new())
    .invoke_handler(tauri::generate_handler![
      commands::spawn_shell,
      commands::write_to_shell,
      commands::resize_terminal,
      commands::close_session,
      filesystem::pick_folder,
      filesystem::read_directory,
      filesystem::read_file,
      filesystem::write_file,
      filesystem::get_file_info,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
