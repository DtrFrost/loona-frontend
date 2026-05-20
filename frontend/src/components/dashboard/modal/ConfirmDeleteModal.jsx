// components/modal/ConfirmDeleteModal.jsx
import ModalPortal from './ModalPortal';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName, 
    itemType,
    isMultiple = false,
    count = 0 
}) {
    const getMessage = () => {
        if (isMultiple) {
            return `Вы действительно хотите удалить ${count} элементов?`;
        }
        return `Вы действительно хотите удалить ${itemType === 'folder' ? 'папку' : 'файл'} "${itemName}"?`;
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="confirm-delete-modal">
                <h3>Подтверждение удаления</h3>
                <p>{getMessage()}</p>
                <p className="warning-text">⚠️ Это действие нельзя отменить!</p>
                
                <div className="confirm-buttons">
                    <button onClick={onConfirm} className="confirm-btn">
                        Да, удалить
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        Отмена
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
}