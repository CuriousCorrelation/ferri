import { Metadata } from "@/types";
import { TextAlignJustifyIcon } from "@radix-ui/react-icons";

interface MetadataDisplayProps {
  metadata: Metadata;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => (
  <div className="mb-4 p-2 bg-gray-100">
    <h2 className="text-xl flex items-center">
      <TextAlignJustifyIcon className="h-4 w-4 mr-2 shrink-0" />
      File Metadata
    </h2>
    <p>Name: {metadata.name}</p>
    <p>Files: {metadata.files}</p>
    <p>Compressed Size: {metadata.compressed_size}</p>
  </div>
);

export default MetadataDisplay;
