import { Button } from "./ui/button";

interface RecentFilesProps {
  recentFiles: string[];
  openZipFile: (filePath: string, password?: string | null) => Promise<void>;
}

const RecentFiles: React.FC<RecentFilesProps> = ({
  recentFiles,
  openZipFile,
}) => {
  const handleClick = (file: string) => {
    openZipFile(file).catch((error: unknown) => {
      console.error("Error opening zip file:", error);
    });
  };

  return (
    <div>
      <span className="text-sm">Recent files</span>
      <ul className="list-disc pl-4">
        {recentFiles.map((file, index) => (
          <li key={index}>
            <Button
              variant="link"
              className="p-0"
              onClick={() => {
                handleClick(file);
              }}
            >
              {file}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFiles;
