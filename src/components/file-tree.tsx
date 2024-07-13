import React from 'react';

interface FileTreeProps {
    fileTree: any;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree }) => {
    const renderTree = (node: any) => {
        return (
            <ul>
                {Object.keys(node).map((key) => (
                    <li key={key}>
                        {key}
                        {typeof node[key] === 'object' ? renderTree(node[key]) : null}
                    </li>
                ))}
            </ul>
        );
    };

    return <div>{renderTree(fileTree)}</div>;
};

export default FileTree;
