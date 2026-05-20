import React, { useState } from 'react';
import styles from './FileIcon.module.css';

const FileIcon = ({ type, fileName, size = 48 }) => {
    const [imgError, setImgError] = useState(false);

    const getIcon = () => {
        const ext = fileName?.split('.').pop()?.toLowerCase() || '';
        
        if (type === 'folder') {
            return getFolderIcon(fileName);
        }
        
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(ext)) 
            return '/src/assets/icons/document.svg';
        
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'svg', 'ai', 'eps', 'raw', 'cr2', 'nef'].includes(ext)) 
            return '/src/assets/icons/image.svg';
        
        if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'ogv', 'mpg', 'mpeg'].includes(ext)) 
            return '/src/assets/icons/video.svg';
        
        if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(ext)) 
            return '/src/assets/icons/audio.svg';
        
        if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso', 'img', 'dmg'].includes(ext)) 
            return '/src/assets/icons/archiv.svg';
        
        if (['ini', 'cfg', 'conf', 'env', 'log', 'tmp', 'ttf', 'otf', 'woff', 'woff2'].includes(ext)) 
            return '/src/assets/icons/system.svg';

        if (['obj', 'fbx', 'blend', 'max', '3ds', 'stl', 'dwg', 'dxf', 'step', 'psd', 'xd', 'sketch', 'fig'].includes(ext)) 
            return '/src/assets/icons/design.svg';
        
        if (['db', 'sqlite', 'mdb', 'accdb', 'sql'].includes(ext)) 
            return '/src/assets/icons/db.svg';

        if (['epub', 'mobi', 'fb2', 'azw', 'azw3', 'chm', 'djvu'].includes(ext)) 
            return '/src/assets/icons/ebook.svg';

        return '/src/assets/icons/file.svg';
    };
    
    const getFolderIcon = (folderName) => {
        const specialFolders = {
            'Documents': '/src/assets/icons/folder-documents.svg',
            'Images': '/src/assets/icons/folder-images.svg',
            'Videos': '/src/assets/icons/folder-videos.svg',
            'Music': '/src/assets/icons/folder-music.svg',
            'Downloads': '/src/assets/icons/folder-downloads.svg',
            'Desktop': '/src/assets/icons/folder-desktop.svg',
        };
        
        if (specialFolders[folderName]) {
            return specialFolders[folderName];
        }
        
        return '/src/assets/icons/folder.svg';
    };
    
    const getFallbackEmoji = () => {
        if (type === 'folder') return 'папка';
        
        const ext = fileName?.split('.').pop()?.toLowerCase() || '';
        
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(ext)) 
            return 'файл';
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'svg'].includes(ext)) 
            return 'изображение';
        if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) 
            return 'видео';
        if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(ext)) 
            return 'аудео';
        if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) 
            return 'архив';
        
        return 'файл';
    };

    const iconSrc = getIcon();
    const fallbackEmoji = getFallbackEmoji();

    const getFallbackFontSize = () => {
        if (size >= 48) return size;
        if (size >= 32) return size;
        return size;
    };

    return (
        <div 
            className={styles.fileIconWrapper} 
            style={{ width: size, height: size }}
        >
            {!imgError ? (
                <img 
                    src={iconSrc} 
                    alt={type === 'folder' ? 'Папка' : 'Файл'}
                    className={styles.fileIconImg}
                    style={{ width: size, height: size }}
                    onError={() => setImgError(true)}
                    loading="lazy"
                />
            ) : (
                <span 
                    style={{ 
                        fontSize: getFallbackFontSize(), 
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    role="img"
                    aria-label={type === 'folder' ? 'Папка' : 'Файл'}
                >
                    {fallbackEmoji}
                </span>
            )}
        </div>
    );
};

export default FileIcon;