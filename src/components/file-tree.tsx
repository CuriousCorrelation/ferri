import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { isEmpty } from "@/lib/utils";
import { ArrowRightIcon, FileIcon, StackIcon } from "@radix-ui/react-icons";
import { FileTreeNode, ZipFileMetadata } from "@/types";

interface FileTreeProps {
  fileTree: FileTreeNode | null;
  fileMetadata: ZipFileMetadata[];
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree, fileMetadata }) => {
  const getFileMetadata = (fileName: string): ZipFileMetadata | undefined => {
    return fileMetadata.find((file) => file.name === fileName);
  };

  const renderTree = (node: FileTreeNode | null, depth = 0, margin = 0) => {
    if (!node) return null;

    const keys = Object.keys(node);

    return (
      <ul className="list-none font-mono" style={{ marginLeft: margin }}>
        {keys.map((key, index) => {
          const obj = node[key];
          const accordionItemValue = `item-${depth.toString()}-${index.toString()}`;
          const metadata = getFileMetadata(key);

          return isEmpty(obj) ? (
            <li key={key} className="flex font-bold justify-between">
              <div className="flex items-center">
                <FileIcon className="h-4 w-4 mr-2 shrink-0" />
                {key}
              </div>
              {metadata && (
                <div className="flex text-xs font-thin gap-2">
                  <p>Size: {metadata.size}</p>
                  <ArrowRightIcon />
                  <p>{metadata.compressed_size}</p>
                </div>
              )}
            </li>
          ) : (
            <li key={key} className="flex">
              <StackIcon className="h-4 w-4 mt-2 shrink-0" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={accordionItemValue}>
                  <AccordionTrigger className="ml-2">{key}</AccordionTrigger>
                  <AccordionContent>
                    {typeof obj === "object"
                      ? renderTree(
                          obj as FileTreeNode,
                          depth + 1,
                          margin + key.length,
                        )
                      : null}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ScrollArea className="w-[555px] h-[670px]">
      {fileTree ? renderTree(fileTree) : <p>Directory is empty.</p>}
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default FileTree;
