import { ZipArchiveMetadata } from "@/types";
import { invoke } from "@tauri-apps/api/tauri";

export async function readZipFileMetadata(
  path: string,
  password: string | null,
): Promise<ZipArchiveMetadata> {
  return invoke<ZipArchiveMetadata>("read_zip_file_metadata", {
    path,
    password,
  });
}
