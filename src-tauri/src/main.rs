#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Menu, MenuItem, Submenu};

fn main() {
    let app_submenu = Submenu::new("File", Menu::new()
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Quit)
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
