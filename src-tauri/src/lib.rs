use std::path::{Path, PathBuf};

use serde::Serialize;
use tauri_plugin_dialog::DialogExt;

/// A file ScryPad read from disk.
#[derive(Serialize)]
struct DiskFile {
    path: String,
    name: String,
    content: String,
}

#[derive(Serialize)]
struct SavedFile {
    path: String,
    name: String,
}

fn file_name(p: &Path) -> String {
    p.file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| "untitled.html".into())
}

fn read_disk_file(p: PathBuf) -> Result<DiskFile, String> {
    let content = std::fs::read_to_string(&p).map_err(|e| format!("Couldn't read {}: {e}", p.display()))?;
    Ok(DiskFile {
        name: file_name(&p),
        path: p.to_string_lossy().into_owned(),
        content,
    })
}

/// File > Open: shows the Open dialog and reads the picked file.
#[tauri::command]
async fn open_file(app: tauri::AppHandle) -> Result<Option<DiskFile>, String> {
    let picked = app
        .dialog()
        .file()
        .add_filter("Web Pages", &["html", "htm"])
        .add_filter("All Files", &["*"])
        .blocking_pick_file();
    match picked {
        Some(fp) => {
            let p = fp.into_path().map_err(|e| e.to_string())?;
            read_disk_file(p).map(Some)
        }
        None => Ok(None),
    }
}

/// Save: writes to a file ScryPad already knows the path of.
#[tauri::command]
async fn write_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| format!("Couldn't save {path}: {e}"))
}

/// Save As: shows the Save dialog, then writes.
#[tauri::command]
async fn save_file_as(app: tauri::AppHandle, suggested_name: String, content: String) -> Result<Option<SavedFile>, String> {
    let picked = app
        .dialog()
        .file()
        .set_file_name(&suggested_name)
        .add_filter("Web Page", &["html", "htm"])
        .blocking_save_file();
    match picked {
        Some(fp) => {
            let p = fp.into_path().map_err(|e| e.to_string())?;
            std::fs::write(&p, content).map_err(|e| format!("Couldn't save {}: {e}", p.display()))?;
            Ok(Some(SavedFile {
                name: file_name(&p),
                path: p.to_string_lossy().into_owned(),
            }))
        }
        None => Ok(None),
    }
}

/// The file ScryPad was started with (double-clicking an .html file in Explorer).
#[tauri::command]
fn launch_file() -> Option<DiskFile> {
    std::env::args_os()
        .skip(1)
        .map(PathBuf::from)
        .find(|p| p.is_file())
        .and_then(|p| read_disk_file(p).ok())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![open_file, write_file, save_file_as, launch_file])
        .run(tauri::generate_context!())
        .expect("error while running ScryPad application");
}
