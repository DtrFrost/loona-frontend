import API_BASE_URL from './config/api'

const getToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('getToken вернул:', token ? 'токен есть' : 'НЕТ ТОКЕНА');
    return token;
};

// Общая функция для запросов с авторизацией
const authFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/auth';
        throw new Error('Сессия истекла');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Ошибка запроса' }));
        throw new Error(error.error || 'Ошибка запроса');
    }

    return response.json();
};

export const fileService = {
    getFiles: async (path = '/') => {
        return authFetch(`/files?path=${encodeURIComponent(path)}`);
    },

    getStats: async () => {
        return authFetch('/storage/stats');
    },

    createFolder: async (name, path = '/') => {
        return authFetch('/files/folders', {
            method: 'POST',
            body: JSON.stringify({ name, path })
        });
    },

    uploadFile: async (file, path = '/') => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: formData
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/auth';
            throw new Error('Сессия истекла');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Ошибка загрузки' }));
            throw new Error(error.error || 'Ошибка загрузки');
        }

        return response.json();
    },

    // Удалить элемент
    deleteItem: async (id) => {
        return authFetch(`/files/${id}`, {
            method: 'DELETE'
        });
    },

    // Скачать один файл
    downloadFile: async (id, fileName) => {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/files/download/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/auth';
            throw new Error('Сессия истекла');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка скачивания');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    // Скачать несколько файлов архивом
    downloadMultiple: async (ids) => {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/files/download-multiple`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids })
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/auth';
            throw new Error('Сессия истекла');
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка скачивания');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `files_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    getFolderSize: async (folderPath) => {
        try {
            // Нормализуем путь
            let normalizedPath = folderPath;
            if (!normalizedPath.startsWith('/')) {
                normalizedPath = '/' + normalizedPath;
            }
            if (normalizedPath.endsWith('/') && normalizedPath !== '/') {
                normalizedPath = normalizedPath.slice(0, -1);
            }

            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/files/folder-size?path=${encodeURIComponent(normalizedPath)}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = '/auth';
                throw new Error('Сессия истекла');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Ошибка запроса' }));
                throw new Error(error.error || 'Ошибка получения размера папки');
            }

            const data = await response.json();
            return data.size;
        } catch (error) {
            console.error('Ошибка получения размера папки:', error);
            return 0;
        }
    },

    // Получить превью файла (только для изображений)
    getPreview: async (fileId) => {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/files/preview/${fileId}`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/auth';
            throw new Error('Сессия истекла');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Ошибка загрузки превью' }));
            throw new Error(error.error || 'Ошибка загрузки превью');
        }

        const blob = await response.blob();

        if (!blob.type.startsWith('image/') && !blob.type.startsWith('video/')) {
            console.warn('Сервер вернул не медиа файл, а:', blob.type);
            throw new Error('Неверный формат медиа');
        }

        return URL.createObjectURL(blob);
    },
};