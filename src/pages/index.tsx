import React, { useReducer } from "react";
import FileTree from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordPrompt } from "@/components/password-prompt";
import RecentFiles from "@/components/recent-files";
import { ZipArchiveMetadata } from "@/types";
import MetadataDisplay from "@/components/metadata-display";
import ErrorMessage from "@/components/error-message";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { useFileHandler } from "@/hooks/file-handler";

interface State {
  requiresPassword: boolean;
  zipFile: string | null;
  metadata: ZipArchiveMetadata | null;
  recentFiles: string[];
  error: string | null;
}

type Action =
  | { type: "SET_REQUIRES_PASSWORD"; payload: boolean }
  | { type: "SET_ZIP_FILE"; payload: string | null }
  | { type: "SET_METADATA"; payload: ZipArchiveMetadata | null }
  | { type: "SET_RECENT_FILES"; payload: string[] }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  requiresPassword: false,
  zipFile: null,
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
  const { chooseFile, openZipFile } = useFileHandler(state, dispatch);

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
              <FileTree
                fileTree={state.metadata.tree}
                fileMetadata={state.metadata.file_metadata}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;
