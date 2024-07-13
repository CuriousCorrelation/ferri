import React, { useState } from 'react';

import { invoke } from '@tauri-apps/api/tauri';
import { open } from "@tauri-apps/api/dialog";

import FileTree from '@/components/file-tree';

const Home: React.FC = () => {
    const [zipFile, setZipFile] = useState<string | null>(null);
    const [fileTree, setFileTree] = useState<any>(null);
    const [metadata, setMetadata] = useState<any>(null);
    const [recentFiles, setRecentFiles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const chooseFile = async () => {
        const selected = await open({ filters: [{ name: "ZIP Files", extensions: ["zip"] }] });
        if (selected) {
            openZipFile(selected as string);
        }
    };

    const openZipFile = async (filePath: string, password: string | null = null) => {
        try {
            const fileData: any = await invoke('open_zip_file', { path: filePath, password });
            setZipFile(filePath);
            setFileTree(fileData.tree);
            setMetadata(fileData.metadata);
            setRecentFiles((prev) => [filePath, ...prev.slice(0, 4)]);
            setError(null);
        } catch (err: any) {
            if (err.includes('Password required')) {
                const userPassword = prompt('Enter password for the ZIP file:');
                if (userPassword) {
                    openZipFile(filePath, userPassword);
                } else {
                    setError('Password is required to open this ZIP file.');
                }
            } else if (err.includes('Invalid password')) {
                setError('The password you entered is incorrect.');
            } else {
                setError(`Failed to open ZIP file: ${err}`);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">ZIP File Viewer</h1>
                <ul className="list-disc pl-4">
                    {recentFiles.slice(0, 5).map((file: string, index: number) => (
                        <li key={index} onClick={() => openZipFile(file)}>
                            {file}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={chooseFile}
                >
                    Choose a ZIP file
                </button>
            </div>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded shadow">{error}</div>}
            {zipFile && (
                <>
                    <div className="mb-4 p-2 bg-gray-100 rounded shadow">
                        <h2 className="text-xl">File Metadata</h2>
                        <p>Name: {metadata.name}</p>
                        <p>Size: {metadata.size}</p>
                        <p>Compressed Size: {metadata.compressed_size}</p>
                    </div>
                    <FileTree fileTree={fileTree} />
                </>
            )}
        </div>
    );
};

export default Home;
