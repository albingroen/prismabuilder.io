#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let minimize = CustomMenuItem::new("minimize".to_string(), "Minimize");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");

    let app_submenu = Submenu::new("File", Menu::new()
        .add_item(hide)
        .add_item(minimize)
        .add_item(close)
        .add_item(quit)
    );

    let edit_submenu = Submenu::new("Edit", Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::SelectAll)
    );

    let menu = Menu::new().add_submenu(app_submenu).add_submenu(edit_submenu);

      tauri::Builder::default()
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
