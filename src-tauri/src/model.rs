use std::{fs::File, ops::Not, path::Path};

use serde::Serialize;
use serde_json::Value;
use tauri::command;
use zip::ZipArchive;

use crate::error::FerriResult;

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
pub(crate) fn open_zip_file(path: String, password: Option<String>) -> FerriResult<ZipFileData> {
    let path = Path::new(&path);
    let file = File::open(path)?;

    let mut archive = ZipArchive::new(file)?;

    let mut tree = serde_json::json!({});

    let mut compressed_size = 0;
    let files = archive.len();
    let name = path.file_name().unwrap().to_str().unwrap().to_string();

    for i in 0..files {
        let file = if let Some(ref password) = password {
            archive.by_index_decrypt(i, password.as_bytes())??
        } else {
            archive.by_index(i)?
        };

        compressed_size += file.compressed_size();

        let parts = file
            .name()
            .split('/')
            .filter(|s| s.is_empty().not())
            .collect::<Vec<_>>();

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
