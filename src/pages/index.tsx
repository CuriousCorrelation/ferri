import React, { useEffect, useReducer } from "react";
import FileTree from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordPrompt } from "@/components/password-prompt";
import RecentFiles from "@/components/recent-files";
import MetadataDisplay from "@/components/metadata-display";
import ErrorMessage from "@/components/error-message";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { useFileHandler } from "@/hooks/file-handler";
import { AppAction, AppState } from "@/types";
import { readRecentFiles } from "@/lib/interop";


const initialAppState: AppState = {
  requiresPassword: false,
  zipFile: null,
  metadata: null,
  recentFiles: [],
  error: null,
};

const reducer = (appState: AppState, appAction: AppAction): AppState => {
  switch (appAction.type) {
    case "SET_REQUIRES_PASSWORD":
      return { ...appState, requiresPassword: appAction.payload };
    case "SET_ZIP_FILE":
      return { ...appState, zipFile: appAction.payload };
    case "SET_METADATA":
      return { ...appState, metadata: appAction.payload };
    case "SET_RECENT_FILES":
      return { ...appState, recentFiles: appAction.payload };
    case "SET_ERROR":
      return { ...appState, error: appAction.payload };
    default:
      return appState;
  }
};

const Home: React.FC = () => {
  const [appState, dispatch] = useReducer(reducer, initialAppState);
  const { chooseFile, openZipFile } = useFileHandler(dispatch);

    useEffect(() => {
    async function fetchRecentFiles() {
      try {
        const files = await readRecentFiles() ?? [];
        dispatch({ type: "SET_RECENT_FILES", payload: files });
      } catch (error) {
        dispatch({ type: "SET_RECENT_FILES", payload: [] });
      }
    }

    fetchRecentFiles();
  }, []); // Empty dependency, run once

  const handleSetPassword = (password: string) => {
    if (appState.zipFile) {
      openZipFile(appState.zipFile, password);
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
        {appState.recentFiles.length > 0 ? (
          <RecentFiles
            recentFiles={appState.recentFiles}
            openZipFile={openZipFile}
          />
        ) : (
          <span>No recent files</span>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {appState.requiresPassword ? (
          <PasswordPrompt onSetPassword={handleSetPassword} />
        ) : (
          <Button onClick={chooseFile}>Choose a ZIP file</Button>
        )}
        <div className="grid gap-2">
          {appState.error && <ErrorMessage error={appState.error} />}
          {appState.zipFile && appState.metadata && (
            <>
              <MetadataDisplay metadata={appState.metadata} />
              <FileTree
                fileTree={appState.metadata.tree}
                fileMetadata={appState.metadata.file_metadata}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;
