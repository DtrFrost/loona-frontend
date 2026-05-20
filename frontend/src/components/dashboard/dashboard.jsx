import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/authContext';
import { fileService } from '../../services/fileService';
import { useFileNavigation } from '../../hooks/useFileNavigation';
import { useFileSelection } from '../../hooks/useFileSelection';
import InfoManager from './infoManager';
import Breadcrumbs from '../BreadCrumbs/Breadcrumbs';
import FileItem from './FileItem';
import FloatingUploadButton from '../FloatingUploadButton';
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';
import ViewToggle from './ViewToggle';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('preferredView') || 'grid';
    });
    const [openContextMenuId, setOpenContextMenuId] = useState(null);
    const dropZoneRef = useRef(null);

    const {
        currentPath,
        navigateToFolder,
        navigateToPath,
        goBack,
        getBreadcrumbItems,
        canGoBack
    } = useFileNavigation('/');

    const {
        selectedItems,
        handleItemClick,
        clearSelection,
        selectAll,
        deselectAll,
        isAllSelected
    } = useFileSelection(files);

    useEffect(() => {
        loadData();
    }, [currentPath]);

    useEffect(() => {
        localStorage.setItem('preferredView', viewMode);
    }, [viewMode]);

    useEffect(() => {
        clearSelection();
    }, [currentPath, clearSelection]);

    const loadData = async () => {
        setLoading(true);
        try {
            console.log('🔄 Загрузка данных для пути:', currentPath);
            const [filesData, statsData] = await Promise.all([
                fileService.getFiles(currentPath),
                fileService.getStats()
            ]);
            setFiles(filesData);
            setStats(statsData);
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        setUploading(true);
        try {
            await fileService.uploadFile(file, currentPath);
            await loadData();
        } catch (error) {
            alert('Ошибка: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await fileService.createFolder(folderName, currentPath);
            await loadData();
        } catch (error) {
            throw error;
        }
    };

    const handleToggleSelect = (id, e) => {
        handleItemClick(id, e);
    };

    const deleteSelected = async () => {
        const idsToDelete = Array.from(selectedItems);

        try {
            for (const id of idsToDelete) {
                await fileService.deleteItem(id);
            }
            clearSelection();
            setShowDeleteConfirm(false);
            setItemToDelete(null);
            await loadData();
        } catch (error) {
            alert('Ошибка при удалении: ' + error.message);
        }
    };

    const handleDelete = (id, name, type) => {
        setItemToDelete({ id, name, type, isMultiple: false });
        setShowDeleteConfirm(true);
    };

    const handleDownload = async (id, name) => {
        try {
            await fileService.downloadFile(id, name);
        } catch (error) {
            alert('Ошибка при скачивании: ' + error.message);
        }
    };

    const downloadSelected = async () => {
        const selectedFiles = files.filter(f => selectedItems.has(f.id) && f.type === 'file');

        if (selectedFiles.length === 0) {
            alert('Выберите файлы для скачивания');
            return;
        }

        try {
            if (selectedFiles.length === 1) {
                await fileService.downloadFile(selectedFiles[0].id, selectedFiles[0].name);
            } else {
                await fileService.downloadMultiple(selectedFiles.map(f => f.id));
            }
        } catch (error) {
            alert('Ошибка при скачивании: ' + error.message);
        }
    };

    const handleFolderClick = (folderName) => {
        navigateToFolder(folderName);
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            deselectAll();
        } else {
            selectAll();
        }
    };

    const handleContextMenuOpen = (id) => {
        setOpenContextMenuId(id);
    };

    const handleContextMenuClose = () => {
        setOpenContextMenuId(null);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            for (const file of files) {
                await handleFileUpload(file);
            }
        }
    };

    const breadcrumbItems = getBreadcrumbItems();
    const hasSelected = selectedItems.size > 0;

    if (loading && files.length === 0) return <div className={styles.loading}>Загрузка...</div>;

    return (
        <div className={styles.dashboard}>
            <InfoManager
                stats={stats}
                onCreateFolder={handleCreateFolder}
                currentPath={currentPath}
            />

            <div className={styles.fileManagerHeader}>
                <Breadcrumbs
                    items={breadcrumbItems}
                    onNavigate={navigateToPath}
                    onGoBack={goBack}
                    canGoBack={canGoBack}
                />

                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>

            {/* Панель выделения всегда видна */}
            <div className={styles.selectionToolbar}>
                <span className={styles.selectedCount}>
                    {hasSelected ? `Выбрано: ${selectedItems.size}` : 'Ничего не выбрано'}
                </span>
                <button onClick={handleSelectAll} className={styles.toolbarBtn}>
                    <img src="./src/assets/icons/chouse.svg" alt="выбрать" />
                    <span className={styles.tooltipText}>
                        Выделить всё
                    </span>
                </button>
                <button
                    onClick={downloadSelected}
                    className={`${styles.toolbarBtn} ${!hasSelected ? styles.disabled : ''}`}
                    disabled={!hasSelected}
                >
                    <span className={styles.tooltipText}>
                        Скачать
                    </span>
                    <img src="./src/assets/icons/download.svg" alt="скачать" />
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`${styles.toolbarBtn} ${styles.del} ${!hasSelected ? styles.disabled : ''}`}
                    disabled={!hasSelected}
                >
                    <span className={styles.tooltipText}>
                        Удалить
                    </span>
                    <img src="./src/assets/icons/delete.svg" alt="удалить" />
                </button>
            </div>

            <div
                ref={dropZoneRef}
                className={`${styles.filesContainer} ${isDragOver ? styles.dragOver : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => {
                    if (!openContextMenuId) {
                        clearSelection();
                    }
                }}
            >
                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : files.length === 0 ? (
                    <div className={styles.emptyFolder}>
                        <div className={styles.emptyIcon}>
                            <img src="./src/assets/null-folder.svg" alt="пустая папка" />
                        </div>
                        <p>Папка пуста</p>
                        <p className={styles.dragHint}>Перетащите файлы сюда для загрузки</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className={styles.filesGrid}>
                        {files.map(item => (
                            <FileItem
                                key={item.id}
                                item={item}
                                isSelected={selectedItems.has(item.id)}
                                onToggleSelect={handleToggleSelect}
                                onFolderClick={handleFolderClick}
                                onDelete={handleDelete}
                                onDownload={handleDownload}
                                onContextMenuOpen={handleContextMenuOpen}
                                onContextMenuClose={handleContextMenuClose}
                                openContextMenuId={openContextMenuId}
                                viewMode="grid"
                            />
                        ))}
                    </div>
                ) : (
                    <table className={styles.filesTable}>
                        <thead>
                            <tr>
                                <th className={styles.iconCell}></th>
                                <th className={styles.nameCell}>Имя</th>
                                <th className={styles.sizeCell}>Размер</th>
                                <th className={styles.dateCell}>Дата изменения</th>
                                <th className={styles.actionsCell}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map(item => (
                                <FileItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItems.has(item.id)}
                                    onToggleSelect={handleToggleSelect}
                                    onFolderClick={handleFolderClick}
                                    onDelete={handleDelete}
                                    onDownload={handleDownload}
                                    onContextMenuOpen={handleContextMenuOpen}
                                    onContextMenuClose={handleContextMenuClose}
                                    openContextMenuId={openContextMenuId}
                                    viewMode="list"
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <FloatingUploadButton
                onFileUpload={handleFileUpload}
                uploading={uploading}
            />

            <ConfirmDeleteModal
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                }}
                onConfirm={itemToDelete?.isMultiple ? deleteSelected : () => {
                    if (itemToDelete) {
                        fileService.deleteItem(itemToDelete.id).then(() => {
                            loadData();
                            clearSelection();
                            setShowDeleteConfirm(false);
                            setItemToDelete(null);
                        });
                    } else if (selectedItems.size > 0) {
                        deleteSelected();
                    }
                }}
                itemName={itemToDelete?.name}
                itemType={itemToDelete?.type}
                isMultiple={itemToDelete?.isMultiple || (!itemToDelete && selectedItems.size > 1)}
                count={selectedItems.size}
            />
        </div>
    );
}