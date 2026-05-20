import React, { useState } from 'react';
import CreateFolderModal from './modal/CreateFolderModal';
import styles from './InfoManager.module.css';

export default function InfoManager({ stats, onCreateFolder, currentPath }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const usedBytes = stats?.usedBytes || 0;
  const totalSpace = stats?.total || 5;
  const percent = stats?.percent || 0;

  const formatSpaceInMB = () => {
    const usedMB = usedBytes / (1024 * 1024);
    const totalGB = totalSpace;
    return `${usedMB.toFixed(2)} МБ из ${totalGB} ГБ`;
  };

  console.log('📊 InfoManager stats:', {
    usedBytes,
    usedMB: (usedBytes / (1024 * 1024)).toFixed(2),
    totalSpace,
    percent: percent.toFixed(4)
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.weightBlock}>
          <div className={styles.weightText}>
            <h2>Занято места на диске</h2>
            <span>{formatSpaceInMB()}</span>
          </div>
          <div className={styles.weightLine}>
            <div
              className={styles.weightLineFill}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>

        <div className={styles.folderBlock} onClick={() => setModalOpen(true)}>
          <span>Создать папку</span>
          <img src="./src/assets/addFolder.svg" alt="add_folder" />
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoContent}>
            <span className={styles.bold}>Файлы</span> можно <span className={styles.bold}>загрузить</span> через кнопку в правом нижнем углу либо перетащить файл в рабочую область
          </div>
        </div>
      </div>

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreateFolder={onCreateFolder}
        currentPath={currentPath}
      />
    </>
  );
}