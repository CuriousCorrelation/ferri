import React, { useCallback } from "react";
import { open } from "@tauri-apps/api/dialog";
import { AppAction } from "@/types";
import {
  readRecentFiles,
  readZipFileMetadata,
  storeRecentFiles,
} from "@/lib/interop";

export const useFileHandler = (dispatch: React.Dispatch<AppAction>) => {
  const handleErrors = useCallback(
    (err: string) => {
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
      } catch (err) {
        handleErrors(err as string);
      }
    },
    [dispatch, handleErrors],
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
        payload: newRecentFiles,
      });
    },
    [dispatch],
  );

  const chooseFile = useCallback(async () => {
    try {
      const selected = await open({
        filters: [{ name: "ZIP Files", extensions: ["zip"] }],
      });

      if (selected) {
        await updateRecentFiles(selected as string);
        await openZipFile(selected as string);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error selecting file." });
    }
  }, [dispatch, openZipFile, updateRecentFiles]);

  return { chooseFile, openZipFile };
};
