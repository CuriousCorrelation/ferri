use thiserror::Error;

#[derive(Error, Debug)]
pub(crate) enum FerriError {
    #[error("Failed to open file: {0}")]
    FileOpen(#[from] std::io::Error),
    #[error("Failed to read ZIP archive: {0}")]
    Zip(#[from] zip::result::ZipError),
    #[error("Invalid password")]
    InvalidPassword(#[from] zip::result::InvalidPassword),
}

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

pub(crate) type FerriResult<T> = Result<T, FerriError>;
