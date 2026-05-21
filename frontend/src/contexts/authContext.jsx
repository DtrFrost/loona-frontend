import React, { createContext, useState, useContext, useEffect } from 'react';

import API_BASE_URL from '../../config/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        let token = localStorage.getItem('token');
        
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        
        console.log('🔍 checkAuth: токен найден?', !!token);
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Пользователь авторизован:', userData.name, 'Роль:', userData.role);
                setUser(userData);
            } else {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                console.log('❌ Токен невалиден, очищаем');
            }
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    if (data.error === 'Пользователь не найден') {
                        throw new Error('Пользователь не найден');
                    } else if (data.error === 'Неверный пароль') {
                        throw new Error('Неверный пароль');
                    }
                }
                throw new Error(data.error || 'Ошибка входа');
            }

            console.log('✅ Токен получен при входе');
            console.log('👤 Роль пользователя:', data.user.role);
            
            if (rememberMe) {
                localStorage.setItem('token', data.token);
                sessionStorage.removeItem('token');
                console.log('✅ Токен сохранён в localStorage');
            } else {
                sessionStorage.setItem('token', data.token);
                localStorage.removeItem('token');
                console.log('✅ Токен сохранён в sessionStorage');
            }
            
            setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                created_at: data.user.created_at
            });
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Ошибка входа:', error);
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.error === 'Пользователь с таким email уже существует') {
                    throw new Error('Пользователь с таким email уже существует');
                }
                throw new Error(data.error || 'Ошибка регистрации');
            }

            console.log('✅ Регистрация успешна, роль:', data.user.role);
            
            sessionStorage.setItem('token', data.token);
            localStorage.removeItem('token');
            
            setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                created_at: data.user.created_at
            });
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
        console.log('👋 Выход выполнен');
    };

    const refreshAuth = () => {
        checkAuth();
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            checkAuth,
            refreshAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};