import React, { useEffect, useRef } from 'react';
import styles from './ContextMenu.module.css';

export default function ContextMenu({ x, y, onDownload, onDelete, onClose }) {
    const menuRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = React.useState({ x, y });

    useEffect(() => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let newX = x;
            let newY = y;
            
            if (x + menuRect.width > viewportWidth) {
                newX = viewportWidth - menuRect.width - 10;
            }
            
            if (y + menuRect.height > viewportHeight) {
                newY = viewportHeight - menuRect.height - 10;
            }
            
            if (newX < 10) newX = 10;

            if (newY < 10) newY = 10;
            
            setAdjustedPosition({ x: newX, y: newY });
        }
    }, [x, y]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleScroll = () => {
            onClose();
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onClose]);

    return (
        <div 
            ref={menuRef}
            className={styles.contextMenu} 
            style={{ 
                top: adjustedPosition.y, 
                left: adjustedPosition.x 
            }}
        >
            <div onClick={onDownload} className={styles.contextMenuItem}>
                <span>Скачать</span>
                <img src="./src/assets/icons/download.svg" alt="скачать"/>
            </div>
            <div onClick={onDelete} className={`${styles.contextMenuItem} ${styles.delete}`}>
                <span>Удалить</span>
                <img src="./src/assets/icons/delete.svg" alt="удалить"/>
            </div>
        </div>
    );
}