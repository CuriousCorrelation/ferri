import React, { useCallback } from "react";
import { open } from "@tauri-apps/api/dialog";
import { AppAction } from "@/types";
import {
  readRecentFiles,
  readZipFileMetadata,
  storeRecentFiles,
} from "@/lib/interop";

export const useFileHandler = (
  dispatch: React.Dispatch<AppAction>,
) => {
  const chooseFile = useCallback(async () => {
    try {
      const selected = await open({
        filters: [{ name: "ZIP Files", extensions: ["zip"] }],
      });

      updateRecentFiles(selected as string);

      if (selected) {
        openZipFile(selected as string);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error selecting file." });
    }
  }, [dispatch]);

  const openZipFile = useCallback(
    async (filePath: string, password: string | null = null) => {
      if (!filePath) {
        dispatch({ type: "SET_ERROR", payload: "File path is invalid." });
        return;
      }

      try {
        dispatch({ type: "SET_ZIP_FILE", payload: filePath });
        const metadata = await readZipFileMetadata(filePath, password);

        dispatch({ type: "SET_METADATA", payload: metadata });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_REQUIRES_PASSWORD", payload: false });
      } catch (err: any) {
        handleErrors(err);
      }
    },
    [dispatch],
  );

  const handleErrors = useCallback(
    (err: any) => {
      if (err.includes("Password required")) {
        dispatch({ type: "SET_REQUIRES_PASSWORD", payload: true });
        dispatch({
          type: "SET_ERROR",
          payload: "Password is required to open this ZIP file.",
        });
      } else if (err.includes("Invalid password")) {
        dispatch({
          type: "SET_ERROR",
          payload: "The password you entered is incorrect.",
        });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: `Failed to open ZIP file: ${err}`,
        });
      }
    },
    [dispatch],
  );

  const updateRecentFiles = useCallback(
    async (filePath: string) => {
      const recentFiles = (await readRecentFiles()) ?? [];

      const newRecentFiles = [
        ...recentFiles.filter((file: string) => file !== filePath).slice(0, 4),
        filePath,
      ];

      await storeRecentFiles(newRecentFiles);

      dispatch({
        type: "SET_RECENT_FILES",
        payload: newRecentFiles ?? [],
      });
    },
    [dispatch],
  );

  return { chooseFile, openZipFile };
};
