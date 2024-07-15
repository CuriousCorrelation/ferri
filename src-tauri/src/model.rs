use serde::Serialize;
use serde_json::Value;

/// Represents metadata for a ZIP archive.
///
/// Holds the overall metadata for a ZIP archive, including its name,
/// total size, total compressed size, metadata for each file in the archive, and
/// a hierarchical representation of the directory structure.
#[derive(Serialize)]
pub(crate) struct ZipArchiveMetadata {
    name: String,
    archive_size: String,
    archive_compressed_size: String,
    file_metadata: Vec<ZipFileMetadata>,
    tree: Value,
}

impl ZipArchiveMetadata {
    /// Constructs a new `ZipArchiveMetadata`.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the ZIP archive.
    /// * `archive_size` - The total size of the archive in a human-readable format.
    /// * `archive_compressed_size` - The total compressed size of the archive in a human-readable format.
    /// * `file_metadata` - A vector containing metadata for each file in the archive.
    /// * `tree` - A JSON value representing the hierarchical directory structure of the archive.
    ///
    /// # Returns
    ///
    /// A new instance of `ZipArchiveMetadata`.
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

/// Represents metadata for a file within a ZIP archive.
///
/// This structure holds the metadata for an individual file within a ZIP archive,
/// including its name, size, and compressed size.
#[derive(Serialize)]
pub(crate) struct ZipFileMetadata {
    name: String,
    size: String,
    compressed_size: String,
}

impl ZipFileMetadata {
    /// Constructs a new `ZipFileMetadata`.
    ///
    /// # Arguments
    ///
    /// * `name` - The name of the file.
    /// * `size` - The size of the file in a human-readable format.
    /// * `compressed_size` - The compressed size of the file in a human-readable format.
    ///
    /// # Returns
    ///
    /// A new instance of `ZipFileMetadata`.
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
