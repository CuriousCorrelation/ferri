use thiserror::Error;

/// Custom error type for handling errors in ZIP archive operations.
#[derive(Error, Debug)]
pub(crate) enum FerriError {
    /// Error encountered while opening a file.
    #[error("Failed to open file: {0}")]
    FileOpen(#[from] std::io::Error),

    /// Error encountered while reading a ZIP archive.
    #[error("Failed to read ZIP archive: {0}")]
    Zip(#[from] zip::result::ZipError),

    /// Error indicating an invalid password provided for decrypting a ZIP archive.
    #[error("Invalid password")]
    InvalidPassword(#[from] zip::result::InvalidPassword),
}

/// Conversion trait to convert `FerriError` into `tauri::InvokeError`.
impl Into<tauri::InvokeError> for FerriError {
    fn into(self) -> tauri::InvokeError {
        match self {
            FerriError::Zip(err) => tauri::InvokeError::from(format!("Zip error: {}", err)),
            FerriError::FileOpen(err) => {
                tauri::InvokeError::from(format!("File open error: {}", err))
            }
            FerriError::InvalidPassword(_) => {
                tauri::InvokeError::from(format!("Incorrect password for the zip file."))
            }
        }
    }
}

/// Result type alias for operations that may return `FerriError`.
pub(crate) type FerriResult<T> = Result<T, FerriError>;
