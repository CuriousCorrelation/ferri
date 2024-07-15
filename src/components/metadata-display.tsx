import React from "react";
import { ZipArchiveMetadata } from "@/types";
import { TextAlignJustifyIcon } from "@radix-ui/react-icons";

interface MetadataDisplayProps {
  metadata: ZipArchiveMetadata;
}

const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => (
  <div className="mb-4 p-2 bg-gray-100">
    <h2 className="text-xl flex items-center">
      <TextAlignJustifyIcon className="h-4 w-4 mr-2 shrink-0" />
      Archive Metadata
    </h2>
    <p>Name: {metadata.name}</p>
    <p>Archive Size: {metadata.archive_size}</p>
    <p>Compressed Size: {metadata.archive_compressed_size}</p>
  </div>
);

export default MetadataDisplay;
