import { ZipArchiveMetadata } from "@/types";
import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

export async function readRecentFiles(): Promise<string[] | undefined> {
  const files = await store.get<{ value: string[] }>("recentFiles");

  return files?.value;
}

export async function storeRecentFiles(files: string[]): Promise<void> {
  await store.set("recentFiles", { value: files });
  await store.save();
}

export async function readZipFileMetadata(
  path: string,
  password: string | null,
): Promise<ZipArchiveMetadata> {
  return invoke<ZipArchiveMetadata>("read_zip_file_metadata", {
    path,
    password,
  });
}
