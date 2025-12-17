use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileNode {
    name: String,
    path: String,
    is_directory: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    children: Option<Vec<FileNode>>,
}

/// Open a folder picker dialog and return the selected path
#[tauri::command]
pub async fn pick_folder(_app: AppHandle) -> Result<Option<String>, String> {
    // Note: This is a placeholder. In Tauri v2, use tauri-plugin-dialog
    // For now, we'll return None and users can manually specify a path
    Ok(None)
}

/// Read directory contents recursively and build a file tree
#[tauri::command]
pub async fn read_directory(path: String) -> Result<Vec<FileNode>, String> {
    let path = Path::new(&path);

    if !path.exists() {
        return Err("Path does not exist".to_string());
    }

    if !path.is_dir() {
        return Err("Path is not a directory".to_string());
    }

    build_file_tree(path, 0).map_err(|e| e.to_string())
}

/// Build file tree with limited depth to avoid infinite recursion
fn build_file_tree(path: &Path, depth: usize) -> Result<Vec<FileNode>, std::io::Error> {
    const MAX_DEPTH: usize = 5;

    if depth > MAX_DEPTH {
        return Ok(vec![]);
    }

    let mut nodes = Vec::new();
    let entries = fs::read_dir(path)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip hidden files and common ignored directories
        if name.starts_with('.') || name == "node_modules" || name == "target" || name == "dist" {
            continue;
        }

        let is_directory = path.is_dir();
        let path_str = path.to_string_lossy().to_string();

        let children = if is_directory {
            match build_file_tree(&path, depth + 1) {
                Ok(children) if !children.is_empty() => Some(children),
                _ => None,
            }
        } else {
            None
        };

        nodes.push(FileNode {
            name,
            path: path_str,
            is_directory,
            children,
        });
    }

    // Sort: directories first, then files, both alphabetically
    nodes.sort_by(|a, b| {
        match (a.is_directory, b.is_directory) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(nodes)
}

/// Read file contents
#[tauri::command]
pub async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

/// Write file contents
#[tauri::command]
pub async fn write_file(path: String, contents: String) -> Result<(), String> {
    fs::write(&path, contents).map_err(|e| format!("Failed to write file: {}", e))
}

/// Get file metadata
#[tauri::command]
pub async fn get_file_info(path: String) -> Result<FileInfo, String> {
    let metadata = fs::metadata(&path).map_err(|e| format!("Failed to get file info: {}", e))?;

    Ok(FileInfo {
        size: metadata.len(),
        is_directory: metadata.is_dir(),
        is_readonly: metadata.permissions().readonly(),
    })
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    size: u64,
    is_directory: bool,
    is_readonly: bool,
}
