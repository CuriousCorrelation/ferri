use std::{fs::File, ops::Not, path::Path};

use zip::ZipArchive;

use crate::{
    error::{FerriError, FerriResult},
    model::{ZipArchiveMetadata, ZipFileMetadata},
};

#[tauri::command]
pub(crate) fn read_zip_file_metadata(
    path: &str,
    password: Option<&str>,
) -> FerriResult<ZipArchiveMetadata> {
    let path = Path::new(&path);
    let file = File::open(path)?;

    let name = path.file_name().unwrap().to_str().unwrap().to_string();

    let mut tree = serde_json::json!({});

    let mut archive = ZipArchive::new(file)?;

    let files = archive.len();

    let mut archive_size = 0;
    let mut archive_compressed_size = 0;

    let file_metadata = Vec::from_iter(0..files)
        .into_iter()
        .map(|i| {
            let file = if let Some(ref password) = password {
                archive.by_index_decrypt(i, password.as_bytes())??
            } else {
                archive.by_index(i)?
            };

            let size = file.size();
            let compressed_size = file.compressed_size();

            archive_size += size;
            archive_compressed_size += compressed_size;

            let path_parts = file
                .name()
                .split('/')
                .filter(|s| s.is_empty().not())
                .collect::<Vec<_>>();

            let name = path_parts
                .last()
                .map(|n| n.to_string())
                .unwrap_or("[UNREADABLE]".to_string());

            let mut current = &mut tree;

            for part in path_parts {
                current = current
                    .as_object_mut()
                    .unwrap()
                    .entry(part)
                    .or_insert_with(|| serde_json::json!({}));
            }

            Ok::<_, FerriError>(ZipFileMetadata::new(
                name,
                size,
                compressed_size,
            ))
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(ZipArchiveMetadata::new(
        name,
        archive_size,
        archive_compressed_size,
        file_metadata,
        tree,
    ))
}
