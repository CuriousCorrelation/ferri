use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
pub(crate) struct ZipArchiveMetadata {
    name: String,
    archive_size: u64,
    archive_compressed_size: u64,
    file_metadata: Vec<ZipFileMetadata>,
    tree: Value,
}

impl ZipArchiveMetadata {
    pub(crate) fn new(
        name: String,
        archive_size: u64,
        archive_compressed_size: u64,
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
    size: u64,
    compressed_size: u64,
}

impl ZipFileMetadata {
    pub(crate) fn new(
        name: String,
        size: u64,
        compressed_size: u64,
    ) -> Self {
        Self {
            name,
            size,
            compressed_size,
        }
    }
}
