import { useState, useCallback } from 'react';

export function useFileSelection(files) {
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [lastSelectedId, setLastSelectedId] = useState(null);

    // Выделение одного элемента (с поддержкой Ctrl)
    const toggleSelect = useCallback((id, e) => {
        if (e && (e.ctrlKey || e.metaKey)) {
            // Ctrl + клик: добавляем/убираем текущий элемент
            setSelectedItems(prev => {
                const newSelected = new Set(prev);
                if (newSelected.has(id)) {
                    newSelected.delete(id);
                } else {
                    newSelected.add(id);
                }
                return newSelected;
            });
        } else {
            // Обычный клик: проверяем, выделен ли уже элемент
            setSelectedItems(prev => {
                // Если элемент уже выделен - снимаем выделение только с него
                if (prev.has(id)) {
                    const newSelected = new Set(prev);
                    newSelected.delete(id);
                    return newSelected;
                }
                // Если не выделен - выделяем только его
                return new Set([id]);
            });
        }
        setLastSelectedId(id);
    }, []);

    // Выделение диапазона (с поддержкой Shift)
    const selectRange = useCallback((startId, endId) => {
        const fileIds = files.map(f => f.id);
        const startIndex = fileIds.indexOf(startId);
        const endIndex = fileIds.indexOf(endId);
        
        if (startIndex === -1 || endIndex === -1) return;
        
        const from = Math.min(startIndex, endIndex);
        const to = Math.max(startIndex, endIndex);
        const rangeIds = new Set(fileIds.slice(from, to + 1));
        
        setSelectedItems(rangeIds);
    }, [files]);

    // Обработчик клика с поддержкой Shift
    const handleItemClick = useCallback((id, e) => {
        if (e.shiftKey && lastSelectedId && lastSelectedId !== id) {
            // Shift + клик: выделяем диапазон
            selectRange(lastSelectedId, id);
        } else if (e.ctrlKey || e.metaKey) {
            // Ctrl + клик: переключаем элемент
            toggleSelect(id, e);
        } else {
            // Обычный клик: переключаем (выделяем или снимаем выделение)
            toggleSelect(id, e);
        }
        setLastSelectedId(id);
    }, [lastSelectedId, selectRange, toggleSelect]);

    // Очистка выделения
    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
        setLastSelectedId(null);
    }, []);

    // Выделить всё
    const selectAll = useCallback(() => {
        setSelectedItems(new Set(files.map(f => f.id)));
    }, [files]);

    // Снять выделение со всех
    const deselectAll = useCallback(() => {
        setSelectedItems(new Set());
    }, []);

    // Проверка, выделены ли все
    const isAllSelected = selectedItems.size === files.length && files.length > 0;

    return {
        selectedItems,
        lastSelectedId,
        toggleSelect,
        handleItemClick,
        clearSelection,
        selectAll,
        deselectAll,
        isAllSelected
    };
}