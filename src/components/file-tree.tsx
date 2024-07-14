import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { isEmpty } from "@/lib/utils";
import { FileIcon, StackIcon } from "@radix-ui/react-icons";

interface FileTreeProps {
  fileTree: Record<string, any> | null;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree }) => {
  const renderTree = (node: Record<string, any>, depth = 0, margin = 0) => {
    const keys = Object.keys(node);

    return (
      <ul className="list-none font-mono" style={{ marginLeft: margin }}>
        {keys.map((key, index) => {
          const obj = node[key];
          const accordionItemValue = `item-${depth}-${index}`;

          return isEmpty(obj) ? (
            <li key={key} className="flex font-bold">
              <FileIcon className="h-4 w-4 mr-2 shrink-0" />
              {key}
            </li>
          ) : (
            <li key={key} className="flex">
              <StackIcon className="h-4 w-4 mt-2 shrink-0" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={accordionItemValue}>
                  <AccordionTrigger className="ml-2">{key}</AccordionTrigger>
                  <AccordionContent>
                    {typeof obj === "object"
                      ? renderTree(obj, depth + 1, margin + key.length)
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
    <ScrollArea>
      {fileTree ? renderTree(fileTree) : <p>Directory is empty.</p>}
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default FileTree;
