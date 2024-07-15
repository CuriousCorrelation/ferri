#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

/// # Ferri
///
/// **Ferri** is a zip file previewer written in [Rust](https://www.rust-lang.org/) and the
/// [Tauri](https://tauri.app/) framework with a [React](https://reactjs.org/) and
/// [TypeScript](https://www.typescriptlang.org/) front end. Ferri provides an efficient way
/// to preview the contents of zip files without extracting them. It is designed to be fast,
/// lightweight, and cross-platform.
///
/// ## Features
///
/// - Built with Rust and Tauri, Ferri runs efficiently on various operating systems
///   including Windows, macOS, and Linux.
/// - Reproducible development environment using [devenv](https://devenv.sh/) and
///   [Nix](https://nixos.org/).
/// - Minimal resource usage for quick load times and responsive UI.
/// - Clean user interface built with React and TypeScript, styled using
///   [TailwindCSS](https://tailwindcss.com/).
///
/// ## Screenshots
///
/// See the `screenshots` directory for visual representations of Ferri's features and user interface.
///
/// ## Development Environment
///
/// Ferri's development environment is powered by [devenv](https://devenv.sh/) and [Nix](https://nixos.org/).
///
/// ### Getting Started
///
/// 1. **Activate Developer Environment**: 
///    ```sh
///    devenv shell
///    ```
/// 2. **Start Processes**:
///    ```sh
///    devenv up
///    ```
///
/// ### Prerequisites
///
/// Ensure you have the Nix package manager installed. Follow the [getting started guide](https://devenv.sh/getting-started/)
/// if you need help installing Nix. Learn more about Nix and its benefits for creating reproducible, declarative,
/// and reliable systems at [nixos.org](https://nixos.org/).
///
/// ### Notes
///
/// 1. Using `url: github:NixOS/nixpkgs/nixpkgs-unstable` instead of `url: github:cachix/devenv-nixpkgs/rolling` in `devenv.yaml`
///    to resolve package version mismatches.
/// 2. If you encounter screen artifacts due to version mismatches, run the app with:
///    ```sh
///    WEBKIT_DISABLE_COMPOSITING_MODE=1 pnpm dev
///    ```
///

pub(crate) mod error;
pub(crate) mod interop;
pub(crate) mod model;

use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            on_button_clicked,
            interop::read_zip_file_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
