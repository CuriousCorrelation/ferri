export interface FileTreeNode {
  [key: string]: FileTreeNode | Record<string, never>;
}

export interface ZipArchiveMetadata {
  name: string;
  archive_size: number;
  archive_compressed_size: number;
  file_metadata: ZipFileMetadata[];
  tree: FileTreeNode;
}

export interface ZipFileMetadata {
  name: string;
  size: number;
  compressed_size: number;
}

export type AppAction =
  | { type: "SET_REQUIRES_PASSWORD"; payload: boolean }
  | { type: "SET_ZIP_FILE"; payload: string | null }
  | { type: "SET_METADATA"; payload: ZipArchiveMetadata | null }
  | { type: "SET_RECENT_FILES"; payload: string[] }
  | { type: "SET_ERROR"; payload: string | null };

export interface AppState {
  requiresPassword: boolean;
  zipFile: string | null;
  metadata: ZipArchiveMetadata | null;
  recentFiles: string[];
  error: string | null;
}
