import React, { useState, useEffect } from 'react';
import styles from './Blog.module.css';
import API_BASE_URL from '../config/api';


export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/posts`);
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

    if (loading) {
        return (
            <div className={styles.blogPage}>
                <div className={styles.blogContainer}>
                    <h1>Блог</h1>
                    <div className={styles.loading}>Загрузка...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.blogPage}>
            <div className={styles.blogContainer}>
                <h1>Блог</h1>
                <div className={styles.blogContent}>
                    {posts.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Пока нет постов. Скоро появятся новости!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post.id} className={styles.blogPost}>
                                <div className={styles.postHeader}>
                                    <h2>{post.title}</h2>
                                    <div className={styles.postMeta}>
                                        {post.version && <span className={styles.postVersion}>{post.version}</span>}
                                        <span className={styles.postDate}>
                                            {new Date(post.created_at).toLocaleDateString('ru-RU', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    className={styles.postBody} 
                                    dangerouslySetInnerHTML={{ __html: post.content }} 
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}