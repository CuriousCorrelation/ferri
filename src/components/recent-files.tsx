import { Button } from "./ui/button";

interface RecentFilesProps {
  recentFiles: string[];
  openZipFile: (filePath: string, password?: string | null) => void;
}

const RecentFiles: React.FC<RecentFilesProps> = ({
  recentFiles,
  openZipFile,
}) => (
  <div>
    <span className="text-sm">Recent files</span>
    <ul className="list-disc pl-4">
      {recentFiles.map((file, index) => (
        <li key={index}>
          <Button
            variant="link"
            className="p-0"
            onClick={() => openZipFile(file)}
          >
            {file}
          </Button>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentFiles;
