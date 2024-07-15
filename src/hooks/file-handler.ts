import React, { useCallback } from "react";
import { open } from "@tauri-apps/api/dialog";
import { AppAction, AppState } from "@/types";
import { readZipFileMetadata } from "@/lib/interop";

export const useFileHandler = (
  appState: AppState,
  dispatch: React.Dispatch<AppAction>,
) => {
  const chooseFile = useCallback(async () => {
    try {
      const selected = await open({
        filters: [{ name: "ZIP Files", extensions: ["zip"] }],
      });
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

        updateRecentFiles(filePath);
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
    (filePath: string) => {
      dispatch({
        type: "SET_RECENT_FILES",
        payload: [
          filePath,
          ...appState.recentFiles
            .filter((file: string) => file !== filePath)
            .slice(0, 4),
        ],
      });
    },
    [dispatch, appState.recentFiles],
  );

  return { chooseFile, openZipFile, handleErrors, updateRecentFiles };
};
