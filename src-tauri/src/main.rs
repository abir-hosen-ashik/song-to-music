#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::File;
use std::io::Write;
use std::process::Command;
use tauri::command;

#[command]
fn split_music_bytes(file_name: String, file_bytes: Vec<u8>) -> Result<String, String> {
    let temp_path = format!("/tmp/{}", file_name);

    // Write bytes to temp file
    let mut f = File::create(&temp_path).map_err(|e| e.to_string())?;
    f.write_all(&file_bytes).map_err(|e| e.to_string())?;

    // Call Python Spleeter script
    let output_folder = "./output";
    let status = Command::new("/home/abir-hosen/miniconda3/envs/spleeter-env/bin/python")
        .arg("split_audio.py")
        .arg("--input")
        .arg(&temp_path)
        .arg("--output")
        .arg(output_folder)
        .status()
        .map_err(|e| e.to_string())?;

    if status.success() {
        Ok(output_folder.to_string())
    } else {
        Err("Failed to split audio".into())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![split_music_bytes])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
