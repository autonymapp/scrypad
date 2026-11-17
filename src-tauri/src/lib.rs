use std::path::{Path, PathBuf};

use serde::Serialize;
use tauri::Manager;
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

/// File > Export: save a Site Zip or One HTML File through the Save dialog.
#[tauri::command]
async fn save_bytes_as(app: tauri::AppHandle, suggested_name: String, bytes: Vec<u8>, kind: String) -> Result<Option<SavedFile>, String> {
    let (label, exts): (&str, &[&str]) = if kind == "zip" { ("Zip File", &["zip"]) } else { ("Web Page", &["html", "htm"]) };
    let picked = app
        .dialog()
        .file()
        .set_file_name(&suggested_name)
        .add_filter(label, exts)
        .blocking_save_file();
    match picked {
        Some(fp) => {
            let p = fp.into_path().map_err(|e| e.to_string())?;
            std::fs::write(&p, bytes).map_err(|e| format!("Couldn't save {}: {e}", p.display()))?;
            Ok(Some(SavedFile {
                name: file_name(&p),
                path: p.to_string_lossy().into_owned(),
            }))
        }
        None => Ok(None),
    }
}

/// File > Recent: reopen a file ScryPad opened or saved before.
#[tauri::command]
async fn read_path(path: String) -> Result<DiskFile, String> {
    read_disk_file(PathBuf::from(path))
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

/// View > Pop Out Preview: opens (or brings back) a second window that shows the page.
#[tauri::command]
async fn open_preview_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("preview") {
        let _ = w.unminimize();
        return w.set_focus().map_err(|e| e.to_string());
    }
    tauri::WebviewWindowBuilder::new(&app, "preview", tauri::WebviewUrl::App("popout.html".into()))
        .title("ScryPad Preview")
        .inner_size(960.0, 720.0)
        .min_inner_size(320.0, 240.0)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![open_file, write_file, save_file_as, launch_file, read_path, save_bytes_as, open_preview_window])
        .on_window_event(|window, event| {
            // Closing ScryPad closes its Pop Out Preview too
            if let tauri::WindowEvent::Destroyed = event {
                if window.label() == "main" {
                    if let Some(p) = window.app_handle().get_webview_window("preview") {
                        let _ = p.destroy();
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running ScryPad application");
}
