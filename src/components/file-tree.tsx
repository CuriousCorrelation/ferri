import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface FileTreeProps {
  fileTree: JSON | null;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree }) => {
  const renderTree = (node: any, depth = 0, margin = 0) => {
    const keys = Object.keys(node);

    return (
      <ul className="list-none font-mono" style={{ marginLeft: margin * 2 }}>
        {keys.map((key, index, array) => {
          const isLastChild = index === array.length - 1;
          const obj = node[key];

          return (
            <li key={key}>
              <div className="flex items-center">
                {depth > 0 && (
                  <span >{isLastChild ? "└──" : "├──"}</span>
                )}
                <span>{key}</span>
              </div>
              {typeof obj === "object"
                ? renderTree(node[key], depth + 1, margin + key.length)
                : null}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ScrollArea>
      {renderTree(fileTree)}
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default FileTree;
