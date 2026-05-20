import React, { useState, useEffect, useRef } from 'react';
import ContextMenu from './ContextMenu';
import FileIcon from './FileIcon';
import MediaPreview from './MediaPreview';
import { fileService } from '../../services/fileService';
import styles from './FileItem.module.css';

export default function FileItem({
    item,
    isSelected,
    onToggleSelect,
    onFolderClick,
    onDelete,
    onDownload,
    onContextMenuOpen,
    onContextMenuClose,
    openContextMenuId,
    viewMode = 'grid'
}) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [folderSize, setFolderSize] = useState(null);
    const [loadingSize, setLoadingSize] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const itemRef = useRef(null);

    useEffect(() => {
        if (openContextMenuId !== item.id && showContextMenu) {
            setShowContextMenu(false);
        }
    }, [openContextMenuId, item.id, showContextMenu]);

    useEffect(() => {
        if (viewMode === 'grid') {
            const ext = item.name?.split('.').pop()?.toLowerCase() || '';
            const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
            const videoExts = ['mp4', 'webm', 'mov'];
            setShowPreview(imageExts.includes(ext) || videoExts.includes(ext));
        } else {
            setShowPreview(false);
        }
    }, [item.name, viewMode]);

    useEffect(() => {
        if (item.type === 'folder' && viewMode === 'list' && !folderSize && !loadingSize) {
            loadFolderSize();
        }
    }, [item.type, viewMode]);

    const loadFolderSize = async () => {
        setLoadingSize(true);
        try {
            const folderPath = item.path
                ? `${item.path}/${item.name}`.replace(/\/\//g, '/')
                : `/${item.name}`;

            const size = await fileService.getFolderSize(folderPath);
            setFolderSize(size);
        } catch (error) {
            console.error('Ошибка загрузки размера папки:', error);
            setFolderSize(0);
        } finally {
            setLoadingSize(false);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();

        if (item.type === 'folder') {
            if (e.detail === 2) {
                onFolderClick(item.name);
            } else {
                onToggleSelect(item.id, e);
            }
        } else {
            onToggleSelect(item.id, e);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onContextMenuClose) {
            onContextMenuClose();
        }

        if (!isSelected) {
            onToggleSelect(item.id, e);
        }

        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);

        if (onContextMenuOpen) {
            onContextMenuOpen(item.id);
        }
    };

    const handleDownload = () => {
        onDownload(item.id, item.name);
        setShowContextMenu(false);
        if (onContextMenuClose) {
            onContextMenuClose();
        }
    };

    const handleDelete = () => {
        onDelete(item.id, item.name, item.type);
        setShowContextMenu(false);
        if (onContextMenuClose) {
            onContextMenuClose();
        }
    };

    const handleThreeDotsClick = (e) => {
        e.stopPropagation();

        if (onContextMenuClose) {
            onContextMenuClose();
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setContextMenuPos({ x: rect.left - 150, y: rect.bottom + 5 });
        setShowContextMenu(true);

        if (onContextMenuOpen) {
            onContextMenuOpen(item.id);
        }
    };

    const formatSize = (bytes) => {
        if (!bytes && bytes !== 0) return '';
        if (bytes === 0) return '0 Б';
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    if (viewMode === 'grid') {
        return (
            <>
                <div
                    ref={itemRef}
                    className={`${styles.fileItem} ${isSelected ? styles.selected : ''}`}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                >
                    {showPreview && item.type === 'file' ? (
                        <div className={styles.previewContainer}>
                            <MediaPreview file={item} />
                            <button
                                className={`${styles.fileActionsBtn} ${styles.previewActions}`}
                                onClick={handleThreeDotsClick}
                                title="Действия"
                            >
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </button>
                        </div>
                    ) : (
                        <>
                            <FileIcon type={item.type} fileName={item.name} size={64} />
                            <button
                                className={styles.fileActionsBtn}
                                onClick={handleThreeDotsClick}
                                title="Действия"
                            >
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </button>
                        </>
                    )}

                    <div className={styles.fileInfo}>
                        <div className={styles.fileName} title={item.name}>
                            {item.name}
                        </div>
                        {item.type === 'file' && (
                            <div className={styles.fileSize}>{formatSize(item.size)}</div>
                        )}
                    </div>
                </div>

                {showContextMenu && (
                    <ContextMenu
                        x={contextMenuPos.x}
                        y={contextMenuPos.y}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        onClose={() => {
                            setShowContextMenu(false);
                            if (onContextMenuClose) {
                                onContextMenuClose();
                            }
                        }}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <tr
                ref={itemRef}
                className={`${styles.fileRow} ${isSelected ? styles.selected : ''}`}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                <td className={styles.iconCell}>
                    <FileIcon type={item.type} fileName={item.name} size={32} />
                </td>
                <td className={styles.nameCell}>
                    <div className={styles.fileName} title={item.name}>
                        {item.name}
                    </div>
                </td>
                <td className={styles.sizeCell}>
                    {item.type === 'file'
                        ? formatSize(item.size)
                        : loadingSize
                            ? '⏳'
                            : folderSize !== null
                                ? formatSize(folderSize)
                                : '—'
                    }
                </td>
                <td className={styles.dateCell}>
                    {item.modifiedDate}
                </td>
                <td className={styles.actionsCell}>
                    <button
                        className={styles.tableActionsBtn}
                        onClick={handleThreeDotsClick}
                        title="Действия"
                    >
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </button>
                </td>
            </tr>

            {showContextMenu && (
                <ContextMenu
                    x={contextMenuPos.x}
                    y={contextMenuPos.y}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onClose={() => {
                        setShowContextMenu(false);
                        if (onContextMenuClose) {
                            onContextMenuClose();
                        }
                    }}
                />
            )}
        </>
    );
}