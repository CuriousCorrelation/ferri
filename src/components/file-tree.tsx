import React from 'react';

interface FileTreeProps {
    fileTree: any;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree }) => {
    const renderTree = (node: any, depth = 0, isLast = true) => {
        return (
            <ul style={{ listStyleType: 'none', marginLeft: depth * 20 }}>
                {Object.keys(node).map((key, index, array) => {
                    const isLastChild = index === array.length - 1;
                    return (
                        <li key={key}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {depth > 0 && (
                                    <span style={{ marginRight: 8 }}>
                                        {isLast ? '└──' : '├──'}
                                    </span>
                                )}
                                <span>{key}</span>
                            </div>
                            {typeof node[key] === 'object' ? renderTree(node[key], depth + 1, isLastChild) : null}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return <div>{renderTree(fileTree)}</div>;
};

export default FileTree;
