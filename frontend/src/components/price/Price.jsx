import { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import ModalPortal from '../dashboard/modal/ModalPortal';
import styles from './Price.module.css';

export default function Price() {
    const { isAuthenticated } = useAuth();
    const [selectedTariff, setSelectedTariff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tariffs = [
        {
            id: 1,
            name: 'Бесплатный',
            price: 0,
            period: 'месяц',
            storage: '5 ГБ',
            features: [
                'Безопасное хранение',
                'Доступ к файлам с любого устройства',
                'Синхронизация до 2 устройств',
                'Загрузка файлов до 50 МБ',
                'Базовая поддержка 24/7'
            ],
            color: '#37B6CE',
            popular: false
        },
        {
            id: 2,
            name: 'Про',
            price: 299,
            period: 'месяц',
            storage: '50 ГБ',
            features: [
                'Безопасное хранение',
                'Доступ к файлам с любого устройства',
                'Синхронизация до 5 устройств',
                'Загрузка файлов до 500 МБ',
                'Приоритетная поддержка 24/7',
                'Расширенная статистика',
                'Доступ по ссылке'
            ],
            color: '#4CAF50',
            popular: true
        },
        {
            id: 3,
            name: 'Бизнес',
            price: 599,
            period: 'месяц',
            storage: '200 ГБ',
            features: [
                'Безопасное хранение',
                'Доступ к файлам с любого устройства',
                'Синхронизация до 10 устройств',
                'Загрузка файлов до 2 ГБ',
                'Эксклюзивная поддержка 24/7',
                'Расширенная статистика',
                'Доступ по ссылке',
                'Двухфакторная аутентификация',
                'До 5 участников команды'
            ],
            color: '#FF9800',
            popular: false
        }
    ];

    const handleBuyClick = (tariff) => {
        setSelectedTariff(tariff);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.pricePage}>
            <div className={styles.priceHeader}>
                <h1>Выберите тариф</h1>
                <p>Начните бесплатно, а когда потребуется больше — переходите на платный тариф</p>
            </div>

            <div className={styles.tariffsContainer}>
                {tariffs.map(tariff => (
                    <div 
                        key={tariff.id} 
                        className={`${styles.tariffCard} ${tariff.popular ? styles.popular : ''}`}
                        style={{ '--card-color': tariff.color }}
                    >
                        {tariff.popular && (
                            <div className={styles.popularBadge}>
                                Самый популярный
                            </div>
                        )}
                        
                        <div className={styles.tariffHeader}>
                            <h2>{tariff.name}</h2>
                            <div className={styles.tariffPrice}>
                                {tariff.price === 0 ? (
                                    <span className={styles.free}>Бесплатно</span>
                                ) : (
                                    <>
                                        <span className={styles.price}>{tariff.price}</span>
                                        <span className={styles.currency}>₽</span>
                                        <span className={styles.period}>/{tariff.period}</span>
                                    </>
                                )}
                            </div>
                            <div className={styles.tariffStorage}>
                                {tariff.storage} пространства
                            </div>
                        </div>

                        <div className={styles.tariffFeatures}>
                            <ul>
                                {tariff.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.tariffButton}>
                            {tariff.price === 0 ? (
                                isAuthenticated ? (
                                    <button className={`${styles.btn} ${styles.btnPurchased}`} disabled>
                                        Приобретено
                                    </button>
                                ) : (
                                    <button 
                                        className={`${styles.btn} ${styles.btnFree}`}
                                        onClick={() => window.location.href = '/auth'}
                                    >
                                        Начать бесплатно
                                    </button>
                                )
                            ) : (
                                <button 
                                    className={`${styles.btn} ${styles.btnBuy}`}
                                    style={{ backgroundColor: tariff.color }}
                                    onClick={() => handleBuyClick(tariff)}
                                >
                                    Приобрести
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ModalPortal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.tariffModal}>
                    <div className={styles.modalIcon}>🔧</div>
                    <h3>Функция в разработке</h3>
                    <p>
                        К сожалению, оплата тарифа <strong>"{selectedTariff?.name}"</strong> 
                        временно недоступна.
                    </p>
                    <p className={styles.modalNote}>
                        Мы работаем над внедрением платёжной системы. 
                        Следите за обновлениями!
                    </p>
                    <button 
                        className={styles.modalCloseBtn}
                        onClick={() => setIsModalOpen(false)}
                    >
                        Понятно
                    </button>
                </div>
            </ModalPortal>
        </div>
    );
}