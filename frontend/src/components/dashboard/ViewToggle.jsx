import React from 'react';
import styles from './ViewToggle.module.css';

export default function ViewToggle({ viewMode, onViewChange }) {
    return (
        <div className={styles.viewToggle}>
            <button 
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => onViewChange('list')}
                title="Список"
            >
                <img src="./src/assets/icons/table.svg" alt="таблица"/>
            </button>
            <button 
                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => onViewChange('grid')}
                title="Сетка"
            >
                <img src="./src/assets/icons/grid.svg" alt="сетка"/>
            </button>
        </div>
    );
}