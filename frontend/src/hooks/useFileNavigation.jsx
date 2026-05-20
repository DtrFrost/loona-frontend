import { useState, useCallback } from 'react';

export const useFileNavigation = (initialPath = '/') => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [history, setHistory] = useState([initialPath]);

  // Переход в папку
  const navigateToFolder = useCallback((folderName) => {
    const newPath = currentPath === '/' 
      ? `/${folderName}`
      : `${currentPath}/${folderName}`;
    
    console.log('Переход в папку:', folderName, '→', newPath);
    setCurrentPath(newPath);
    setHistory(prev => [...prev, newPath]);
  }, [currentPath]);

  // Переход по хлебным крошкам
  const navigateToPath = useCallback((targetPath) => {
    console.log('Переход по пути:', targetPath);
    setCurrentPath(targetPath);
    const index = history.findIndex(path => path === targetPath);
    if (index !== -1) {
      setHistory(history.slice(0, index + 1));
    }
  }, [history]);

  // Назад
  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
      console.log('⬅ Назад в:', newHistory[newHistory.length - 1]);
    }
  }, [history]);

  // Получить массив путей для хлебных крошек
  const getBreadcrumbItems = useCallback(() => {
    if (currentPath === '/') return [{ name: 'Главная', path: '/' }];
    
    const parts = currentPath.split('/').filter(Boolean);
    const items = [{ name: 'Главная', path: '/' }];
    
    let accumulatedPath = '';
    parts.forEach(part => {
      accumulatedPath += `/${part}`;
      items.push({ name: part, path: accumulatedPath });
    });
    
    return items;
  }, [currentPath]);

  return {
    currentPath,
    navigateToFolder,
    navigateToPath,
    goBack,
    getBreadcrumbItems,
    canGoBack: history.length > 1
  };
};