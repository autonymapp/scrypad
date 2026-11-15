// Keeps a console window from opening next to ScryPad on Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    scrypad_lib::run()
}
