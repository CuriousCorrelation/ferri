use std::{fs::File, ops::Not, path::Path};

use human_bytes::human_bytes;
use zip::ZipArchive;

use crate::{
    error::{FerriError, FerriResult},
    model::{ZipArchiveMetadata, ZipFileMetadata},
};

/// Reads metadata from a ZIP file.
///
/// This function extracts metadata from a ZIP file located at the specified path. It can handle
/// password-protected ZIP files if a password is provided. The metadata includes the total number
/// of files, uncompressed and compressed sizes, and a hierarchical representation of the directory
/// structure.
///
/// # Arguments
///
/// * `path` - A string slice that holds the path to the ZIP file.
/// * `password` - An optional string slice holding the password for encrypted ZIP files.
///
/// # Returns
///
/// A `FerriResult` containing `ZipArchiveMetadata` if successful, otherwise a `FerriError`.
///
/// # Errors
///
/// This function will return an error if the file cannot be opened, the ZIP archive is invalid,
/// or if any file within the archive cannot be read.
///
/// # Example
///
/// ```
/// let metadata = read_zip_file_metadata("path/to/archive.zip", Some("password"))?;
/// println!("{:?}", metadata);
/// ```
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
                human_bytes(size as f64),
                human_bytes(compressed_size as f64),
            ))
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(ZipArchiveMetadata::new(
        name,
        human_bytes(archive_size as f64),
        human_bytes(archive_compressed_size as f64),
        file_metadata,
        tree,
    ))
}
