import React, { useState, useEffect } from 'react';
import { fileService } from '../../services/fileService';
import styles from './MediaPreview.module.css';

const MediaPreview = ({ file, onLoad, onError }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    
    useEffect(() => {
        if (!file || !file.id) {
            setError(true);
            setLoading(false);
            return;
        }

        const ext = file.name?.split('.').pop()?.toLowerCase() || '';
        const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'];
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        
        const isVideoFile = videoExts.includes(ext);
        const isImageFile = imageExts.includes(ext);
        
        setIsVideo(isVideoFile);
        
        if (isImageFile) {
            loadImagePreview();
        } else if (isVideoFile) {
            loadVideoPreview();
        } else {
            setError(true);
            setLoading(false);
        }
    }, [file]);
    
    const loadImagePreview = async () => {
        setLoading(true);
        setError(false);
        
        try {
            console.log('🖼️ Загрузка превью для:', file.name);
            const url = await fileService.getPreview(file.id);
            setPreviewUrl(url);
            console.log('✅ Превью загружено для:', file.name);
            if (onLoad) onLoad();
        } catch (err) {
            console.error('❌ Ошибка загрузки превью для:', file.name, err.message);
            setError(true);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };
    
    const loadVideoPreview = async () => {
        setLoading(true);
        setError(false);
        
        try {
            console.log('🎬 Загрузка видео:', file.name);
            const url = await fileService.getPreview(file.id);
            setPreviewUrl(url);
            console.log('✅ Видео загружено:', file.name);
            if (onLoad) onLoad();
        } catch (err) {
            console.error('❌ Ошибка загрузки видео:', file.name, err.message);
            setError(true);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return <div className={`${styles.mediaPreview} ${styles.loading}`}>⏳</div>;
    }
    
    if (isVideo && previewUrl) {
        return (
            <div className={`${styles.mediaPreview} ${styles.videoPreview}`}>
                <video 
                    src={previewUrl}
                    preload="metadata"
                    className={styles.videoThumbnail}
                    onError={() => {
                        console.error('❌ Ошибка видео для:', file.name);
                        setError(true);
                    }}
                />
                <div className={styles.videoOverlay}>
                    <span className={styles.playIcon}>▶</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        const fileExt = file.name?.split('.').pop()?.toUpperCase() || 'FILE';
        return (
            <div className={`${styles.mediaPreview} ${styles.error}`}>
                <span>{isVideo ? '🎬' : '🖼️'}</span>
                <span className={styles.fileExt}>{fileExt}</span>
            </div>
        );
    }
    
    if (previewUrl) {
        return (
            <div className={`${styles.mediaPreview} ${styles.imagePreview}`}>
                <img 
                    src={previewUrl} 
                    alt={file.name}
                    onLoad={() => console.log('✅ Изображение отображено:', file.name)}
                    onError={() => {
                        console.error('❌ Ошибка отображения img для:', file.name);
                        setError(true);
                    }}
                />
            </div>
        );
    }
    
    return null;
};

export default MediaPreview;