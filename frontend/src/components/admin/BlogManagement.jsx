import React, { useState, useEffect } from 'react';
import styles from './BlogManagement.module.css';
import API_BASE_URL from '../../config/api';

export default function BlogManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        version: ''
    });

    const getToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/blog/admin/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = getToken();
            const url = editingPost 
                ? `${API_BASE_URL}/blog/admin/posts/${editingPost.id}`
                : `${API_BASE_URL}/blog/admin/posts`;
            
            const method = editingPost ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    isPublished: true
                })
            });
            
            if (response.ok) {
                resetForm();
                fetchPosts();
                alert(editingPost ? 'Пост обновлён' : 'Пост создан');
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка сохранения');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот пост?')) return;
        
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/blog/admin/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                fetchPosts();
                alert('Пост удалён');
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка удаления');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Ошибка удаления');
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            version: post.version || ''
        });
        document.querySelector(`.${styles.blogEditor}`)?.scrollIntoView({ behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            version: ''
        });
    };

    if (loading) return <div className={styles.blogLoading}>Загрузка постов...</div>;

    return (
        <div className={styles.blogManagement}>
            <div className={styles.blogManagementHeader}>
                <h2>Управление блогом</h2>
            </div>

            <div className={styles.blogEditor}>
                <h3>{editingPost ? 'Редактировать пост' : 'Создать новый пост'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Заголовок *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Например: Обновление Beta 0.2"
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Версия (необязательно)</label>
                        <input
                            type="text"
                            value={formData.version}
                            onChange={(e) => setFormData({...formData, version: e.target.value})}
                            placeholder="Например: Beta 0.2"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Содержание *</label>
                        <textarea
                            rows="8"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="Напишите содержание поста... Можно использовать HTML теги (&lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h3&gt; и т.д.)"
                            required
                        />
                        <small className={styles.formHint}>
                            поддерживается HTML - &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;
                        </small>
                    </div>
                    
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnSave}>
                            {editingPost ? 'Обновить пост' : 'Опубликовать пост'}
                        </button>
                        {editingPost && (
                            <button type="button" className={styles.btnCancel} onClick={resetForm}>
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.blogPostsList}>
                <h3>Существующие посты</h3>
                {posts.length === 0 ? (
                    <div className={styles.noPosts}>
                        <p>Нет постов. Создайте первый пост об обновлении!</p>
                    </div>
                ) : (
                    <div className={styles.postsGrid}>
                        {posts.map(post => (
                            <div key={post.id} className={styles.blogPostCard}>
                                <div className={styles.postCardHeader}>
                                    <div className={styles.postTitle}>
                                        <h4>{post.title}</h4>
                                        {post.version && <span className={styles.postVersionBadge}>{post.version}</span>}
                                    </div>
                                    <span className={styles.postDateBadge}>
                                        {new Date(post.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                                <div className={styles.postCardPreview}>
                                    {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                </div>
                                <div className={styles.postCardActions}>
                                    <button onClick={() => handleEdit(post)} className={styles.editPostBtn}>
                                        Редактировать
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className={styles.deletePostBtn}>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}