import { Metadata } from "@/types";

interface MetadataDisplayProps {
  metadata: Metadata;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => (
  <div className="mb-4 p-2 bg-gray-100">
    <h2 className="text-xl">File Metadata</h2>
    <p>Name: {metadata.name}</p>
    <p>Files: {metadata.files}</p>
    <p>Compressed Size: {metadata.compressed_size}</p>
  </div>
);

export default MetadataDisplay;
