import React, { useReducer } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import FileTree from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordPrompt } from "@/components/password-prompt";
import RecentFiles from "@/components/recent-files";
import { Metadata } from "@/types";
import MetadataDisplay from "@/components/metadata-display";
import ErrorMessage from "@/components/error-message";
import { ArchiveIcon } from "@radix-ui/react-icons";

interface FileData {
  tree: any;
  metadata: Metadata;
}

type State = {
  requiresPassword: boolean;
  zipFile: string | null;
  fileTree: JSON | null;
  metadata: Metadata | null;
  recentFiles: string[];
  error: string | null;
};

type Action =
  | { type: "SET_REQUIRES_PASSWORD"; payload: boolean }
  | { type: "SET_ZIP_FILE"; payload: string | null }
  | { type: "SET_FILE_TREE"; payload: JSON | null }
  | { type: "SET_METADATA"; payload: Metadata | null }
  | { type: "SET_RECENT_FILES"; payload: string[] }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  requiresPassword: false,
  zipFile: null,
  fileTree: null,
  metadata: null,
  recentFiles: [],
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_REQUIRES_PASSWORD":
      return { ...state, requiresPassword: action.payload };
    case "SET_ZIP_FILE":
      return { ...state, zipFile: action.payload };
    case "SET_FILE_TREE":
      return { ...state, fileTree: action.payload };
    case "SET_METADATA":
      return { ...state, metadata: action.payload };
    case "SET_RECENT_FILES":
      return { ...state, recentFiles: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const chooseFile = async () => {
    const selected = await open({
      filters: [{ name: "ZIP Files", extensions: ["zip"] }],
    });
    if (selected) {
      openZipFile(selected as string);
    }
  };

  const handleErrors = (err: any) => {
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
  };

  const updateRecentFiles = (filePath: string) => {
    dispatch({
      type: "SET_RECENT_FILES",
      payload: [
        filePath,
        ...state.recentFiles.filter((file) => file !== filePath).slice(0, 4),
      ],
    });
  };

  const openZipFile = async (
    filePath: string,
    password: string | null = null,
  ) => {
    if (!filePath) {
      dispatch({ type: "SET_ERROR", payload: "File path is invalid." });
      return;
    }

    try {
      updateRecentFiles(filePath);
      dispatch({ type: "SET_ZIP_FILE", payload: filePath });

      const fileData = await invoke<FileData>("open_zip_file", {
        path: filePath,
        password,
      });

      dispatch({ type: "SET_FILE_TREE", payload: fileData.tree });
      dispatch({ type: "SET_METADATA", payload: fileData.metadata });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_REQUIRES_PASSWORD", payload: false });
    } catch (err: any) {
      handleErrors(err);
    }
  };

  const handleSetPassword = (password: string) => {
    if (state.zipFile) {
      openZipFile(state.zipFile, password);
    } else {
      dispatch({ type: "SET_ERROR", payload: "No ZIP file selected." });
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2 text-2xl">
          <ArchiveIcon className="h-8 w-8 shrink-0" />
          Zip File Previewer
        </CardTitle>
        {state.recentFiles.length > 0 ? (
          <RecentFiles
            recentFiles={state.recentFiles}
            openZipFile={openZipFile}
          />
        ) : (
          <span>No recent files</span>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {state.requiresPassword ? (
          <PasswordPrompt onSetPassword={handleSetPassword} />
        ) : (
          <Button onClick={chooseFile}>Choose a ZIP file</Button>
        )}
        <div className="grid gap-2">
          {state.error && <ErrorMessage error={state.error} />}
          {state.zipFile && state.metadata && (
            <>
              <MetadataDisplay metadata={state.metadata} />
              <FileTree fileTree={state.fileTree} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;
