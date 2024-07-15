use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
pub(crate) struct ZipArchiveMetadata {
    name: String,
    archive_size: String,
    archive_compressed_size: String,
    file_metadata: Vec<ZipFileMetadata>,
    tree: Value,
}

impl ZipArchiveMetadata {
    pub(crate) fn new(
        name: String,
        archive_size: String,
        archive_compressed_size: String,
        file_metadata: Vec<ZipFileMetadata>,
        tree: Value,
    ) -> Self {
        Self {
            name,
            archive_size,
            archive_compressed_size,
            file_metadata,
            tree,
        }
    }
}

#[derive(Serialize)]
pub(crate) struct ZipFileMetadata {
    name: String,
    size: String,
    compressed_size: String,
}

impl ZipFileMetadata {
    pub(crate) fn new(
        name: String,
        size: String,
        compressed_size: String,
    ) -> Self {
        Self {
            name,
            size,
            compressed_size,
        }
    }
}
