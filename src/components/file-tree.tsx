import { CornerBottomLeftIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';
import React from 'react';

interface FileTreeProps {
    fileTree: JSON | null;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree }) => {
    const renderTree = (node: any, depth = 0, isLast = true) => {
        const keys = Object.keys(node);

        return (
            <ul className='list-none' style={{ marginLeft: depth * 20 }}>
                {keys.map((key, index, array) => {
                    const isLastChild = index === array.length - 1;

                    return (
                        <li key={key}>
                            <div className='flex items-center'>
                                {depth > 0 && (
                                    <span className='mr-1'>
                                        {isLast ? <CornerBottomLeftIcon /> : <DividerHorizontalIcon />}
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
