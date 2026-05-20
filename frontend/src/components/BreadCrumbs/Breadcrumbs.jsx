import React from 'react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ items, onNavigate, onGoBack, canGoBack }) => {
  return (
    <div className={styles.breadcrumbsContainer}>
      <button 
        className={`${styles.breadcrumbsBack} ${!canGoBack ? styles.disabled : ''}`}
        onClick={onGoBack}
        disabled={!canGoBack}
        aria-label="Назад"
      >
        ←
      </button>
      
      <div className={styles.breadcrumbsItems}>
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && <span className={styles.breadcrumbsSeparator}>—</span>}
            <button
              className={`${styles.breadcrumbItem} ${index === items.length - 1 ? styles.active : ''}`}
              onClick={() => onNavigate(item.path)}
              disabled={index === items.length - 1}
              aria-current={index === items.length - 1 ? 'location' : undefined}
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;