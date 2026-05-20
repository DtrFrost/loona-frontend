// CreateFolderModal.jsx
import { useState, useEffect, useCallback } from 'react';
import ModalPortal from './ModalPortal';
import './CreateFolderModal.css';

export default function CreateFolderModal({ isOpen, onClose, onCreateFolder, currentPath }) {
    const [folderName, setFolderName] = useState('');
    const [folderError, setFolderError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Сбрасываем состояние при открытии/закрытии
    useEffect(() => {
        if (!isOpen) {
            setFolderName('');
            setFolderError('');
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleCreate = async () => {
        const trimmedName = folderName.trim();
        
        if (!trimmedName) {
            setFolderError('Введите название папки');
            return;
        }

        setFolderError('');
        setIsLoading(true);

        try {
            await onCreateFolder(trimmedName);
            setFolderName('');
            onClose();
        } catch (error) {
            const errorMessage = error.message || '';
            if (errorMessage.includes('уже существует') || errorMessage.includes('already exists')) {
                setFolderError('Папка с таким именем уже существует');
            } else {
                setFolderError('Ошибка при создании папки');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        console.log('Ввод:', value);
        setFolderName(value);
        if (folderError) setFolderError('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading && folderName.trim()) {
            handleCreate();
        }
    };

    const handleClose = () => {
        setFolderName('');
        setFolderError('');
        onClose();
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={handleClose}>
            <div className="create-folder-modal">
                <h2>Создать новую папку</h2>
                <p className="modal-path">Текущая папка: {currentPath || '/'}</p>
                
                <input
                    type="text"
                    placeholder="Введите название папки..."
                    value={folderName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={folderError ? 'error' : ''}
                    autoFocus
                    disabled={isLoading}
                />
                
                {folderError && <span className="error-message">{folderError}</span>}
                
                <div className="modal-buttons">
                    <button 
                        onClick={handleCreate} 
                        disabled={isLoading || !folderName.trim()} 
                        className="create-btn"
                    >
                        {isLoading ? 'Создание...' : 'Создать'}
                    </button>
                    <button onClick={handleClose} className="cancel-btn" disabled={isLoading}>
                        Отмена
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
}