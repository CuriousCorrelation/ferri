import React, { useState } from "react";
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

const Home: React.FC = () => {
  const [state, setState] = useState({
    requiresPassword: false,
    zipFile: null as string | null,
    fileTree: null as JSON | null,
    metadata: null as Metadata | null,
    recentFiles: [] as string[],
    error: null as string | null,
  });

  // Function to choose a ZIP file
  const chooseFile = async () => {
    const selected = await open({
      filters: [{ name: "ZIP Files", extensions: ["zip"] }],
    });
    if (selected) {
      openZipFile(selected as string);
    }
  };

  // Function to handle errors based on the thrown error message
  const handleErrors = (err: any) => {
    if (err.includes("Password required")) {
      setState((prevState) => ({
        ...prevState,
        requiresPassword: true,
        error: "Password is required to open this ZIP file.",
      }));
    } else if (err.includes("Invalid password")) {
      setState((prevState) => ({
        ...prevState,
        error: "The password you entered is incorrect.",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        error: `Failed to open ZIP file: ${err}`,
      }));
    }
  };

  // Function to update recent files
  const updateRecentFiles = (filePath: string) => {
    setState((prevState) => ({
      ...prevState,
      recentFiles: [
        filePath,
        ...prevState.recentFiles
          .filter((file) => file !== filePath)
          .slice(0, 4),
      ],
    }));
  };

  // Function to open a ZIP file
  const openZipFile = async (
    filePath: string,
    password: string | null = null,
  ) => {
    if (!filePath) {
      setState((prevState) => ({
        ...prevState,
        error: "File path is invalid.",
      }));
      return;
    }

    try {
      updateRecentFiles(filePath);
      setState((prevState) => ({ ...prevState, zipFile: filePath }));

      const fileData = await invoke<FileData>("open_zip_file", {
        path: filePath,
        password,
      });

      setState((prevState) => ({
        ...prevState,
        fileTree: fileData.tree,
        metadata: fileData.metadata,
        error: null,
        requiresPassword: false,
      }));
    } catch (err: any) {
      handleErrors(err);
    }
  };

  // Function to handle setting password
  const handleSetPassword = (password: string) => {
    if (state.zipFile) {
      openZipFile(state.zipFile, password);
    } else {
      setState((prevState) => ({
        ...prevState,
        error: "No ZIP file selected.",
      }));
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
