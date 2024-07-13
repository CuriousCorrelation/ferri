use std::{fs::File, path::Path};

use serde::Serialize;
use serde_json::Value;
use tauri::command;
use zip::ZipArchive;

#[derive(Serialize)]
pub(crate) struct ZipMetadata {
    name: String,
    files: usize,
    compressed_size: u64,
}

#[derive(Serialize)]
pub(crate) struct ZipFileData {
    metadata: ZipMetadata,
    tree: Value,
}

#[command]
pub(crate) fn open_zip_file(path: String, password: Option<String>) -> Result<ZipFileData, String> {
    let path = Path::new(&path);

    let file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;

    let mut archive =
        ZipArchive::new(file).map_err(|e| format!("Failed to read ZIP archive: {}", e))?;

    let mut tree = serde_json::json!({});

    let mut compressed_size = 0;
    let files = archive.len();
    let name = path.file_name().unwrap().to_str().unwrap().to_string();

    for i in 0..archive.len() {
        let file = if let Some(ref password) = password {
            archive
                .by_index_decrypt(i, password.as_bytes())
                .map_err(|e| e.to_string())?
                .map_err(|e| e.to_string())?
        } else {
            archive.by_index(i).map_err(|e| e.to_string())?
        };

        compressed_size += file.compressed_size();

        let parts: Vec<&str> = file.name().split('/').collect();

        let mut current = &mut tree;

        for part in parts {
            current = current
                .as_object_mut()
                .unwrap()
                .entry(part)
                .or_insert_with(|| serde_json::json!({}));
        }
    }

    let metadata = ZipMetadata {
        name,
        files,
        compressed_size,
    };

    Ok(ZipFileData { metadata, tree })
}
