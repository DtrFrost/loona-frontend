import BackGround from './components/BackGround/back_ground';
import Layout from './components/Layout/layout';
import Header from './components/Header/header';
import MainInfo from './components/MainInfo/maininfo';
import Footer from './components/Footer/footer';
import Authorisation from './components/registration/authorisathion';
import About from './components/about/about';
import Dashboard from './components/dashboard/dashboard';
import AdminLayout from './admin/AdminLayout/AdminLayout';
import NotFound from './components/NotFound/NotFound';
import Price from './components/price/Price';
import Blog from './components/blog/Blog';
import AdminDashboard from './pages/AdminDashboard';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './contexts/authContext';

import './App.css';

// Защита маршрута - только для НЕ авторизованных (гостей)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  // Если пользователь уже авторизован, отправляем на дашборд или админку в зависимости от роли
  if (isAuthenticated) {
    const { user } = useAuth();
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />;
  }
  
  return children;
}

// Защита маршрута - только для авторизованных
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// Защита маршрута - только для обычных пользователей (НЕ админов)
function UserRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }
  
  if (!user) return <Navigate to="/auth" />;
  // Если админ - отправляем в админку
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return children;
}

// Защита маршрута - только для админов
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }
  
  if (!user) return <Navigate to="/auth" />;
  // Если не админ - отправляем в дашборд
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

// Внутренний компонент с роутами
function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  return (
    <>
      <BackGround>
        <Layout>
          <Header />

          <Routes>
            {/* Публичные маршруты (доступны всем) */}
            <Route path='/' element={<MainInfo />} />
            <Route path="/price" element={<Price />} />
            <Route path='/about' element={<About />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Маршрут авторизации - только для НЕ авторизованных */}
            <Route path='/auth' element={
              <PublicRoute>
                <Authorisation />
              </PublicRoute>
            } />

            {/* Хранилище - ТОЛЬКО для обычных пользователей (НЕ админов) */}
            <Route path='/dashboard' element={
              <PrivateRoute>
                <UserRoute>
                  <Dashboard />
                </UserRoute>
              </PrivateRoute>
            } />

            {/* Админ-маршруты (только для админов) */}
            <Route path='/admin' element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </PrivateRoute>
            } />

            <Route path='/admin-layout' element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </PrivateRoute>
            } />

            {/* 404 - не найдено */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </Layout>
      </BackGround>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;