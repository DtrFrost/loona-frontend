import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import BlogManagement from '../components/admin/BlogManagement';
import styles from './AdminDashboard.module.css';

import Users from '../assets/icons/users.svg';
import Full from '../assets/icons/full.svg';
import Weight from '../assets/icons/weight.svg';
import Delete from '../assets/icons/delete.svg';
import Analit from '../assets/icons/analit.svg';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const token = getToken();

            const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!usersResponse.ok) {
                const errorData = await usersResponse.json();
                throw new Error(errorData.error || 'Ошибка загрузки пользователей');
            }

            const usersData = await usersResponse.json();
            setUsers(usersData.users);

            const recent = [...usersData.users].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            ).slice(0, 3);
            setRecentUsers(recent);

            const statsResponse = await fetch('http://localhost:5000/api/admin/storage-stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!statsResponse.ok) {
                const errorData = await statsResponse.json();
                throw new Error(errorData.error || 'Ошибка загрузки статистики');
            }

            const statsData = await statsResponse.json();
            setStats(statsData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const token = getToken();

            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                fetchData();
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка обновления роли');
            }
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Ошибка обновления роли');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Вы уверены, что хотите удалить пользователя "${userName}"? Все его файлы будут удалены безвозвратно.`)) {
            return;
        }

        try {
            const token = getToken();

            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchData();
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка удаления пользователя');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Ошибка удаления пользователя');
        }
    };

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0 || bytes === '0' || isNaN(bytes)) return '0 Б';
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.adminLoading}>
                <div className={styles.spinner}></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.adminError}>
                <h2>Ошибка</h2>
                <p>{error}</p>
                <button onClick={fetchData} className={styles.retryBtn}>Повторить</button>
            </div>
        );
    }

    return (
        <div className={styles.adminDashboard}>
            <div className={styles.statsSection}>
                <h2>Статистика сервиса</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <img src={Users} alt="Пользователи" />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.stats?.total_users || 0}</div>
                            <div className={styles.statLabel}>Всего пользователей</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <img src={Weight} alt="Всего" />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.stats?.total_files || 0}</div>
                            <div className={styles.statLabel}>Всего файлов</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <img src={Analit} alt="Аналитика" />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{formatSize(stats?.stats?.total_storage_used || 0)}</div>
                            <div className={styles.statLabel}>Всего занято места</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <img src={Full} alt="Средний размер" />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{formatSize(stats?.stats?.avg_file_size || 0)}</div>
                            <div className={styles.statLabel}>Средний размер файла</div>
                        </div>
                    </div>
                </div>

                {recentUsers.length > 0 && (
                    <div className={styles.recentUsers}>
                        <h3>Последние зарегистрированные пользователи</h3>
                        <div className={styles.recentUsersList}>
                            {recentUsers.map((recentUser, index) => (
                                <div key={index} className={styles.recentUserItem}>
                                    <span className={styles.recentUserName}>{recentUser.name}</span>
                                    <span className={styles.recentUserEmail}>{recentUser.email}</span>
                                    <span className={styles.recentUserDate}>{formatDate(recentUser.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BlogManagement />

            <div className={styles.usersSection}>
                <h2>Управление пользователями</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.usersTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Роль</th>
                                <th>Файлов</th>
                                <th>Использовано места</th>
                                <th>Дата регистрации</th>
                                <th>Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                                            className={`${styles.roleSelect} ${u.role === 'admin' ? styles.roleAdmin : styles.roleUser}`}
                                            disabled={u.id === user?.id}
                                        >
                                            <option value="user">Пользователь</option>
                                            <option value="admin">Администратор</option>
                                        </select>
                                    </td>
                                    <td>{u.files_count || 0}</td>
                                    <td>{formatSize(u.total_storage_used || 0)}</td>
                                    <td>{formatDate(u.created_at)}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteUser(u.id, u.name)}
                                            className={styles.deleteBtn}
                                            disabled={u.id === user?.id}
                                            title={u.id === user?.id ? "Нельзя удалить самого себя" : "Удалить пользователя"}
                                        >
                                            <img src={Delete} alt="Удалить" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}