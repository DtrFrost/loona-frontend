import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../contexts/authContext";
import logoSvg from '/src/public/logo.svg';


export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <header>
        <div className="header__logo">
          <NavLink to="/" id="logo">
            <img src={logoSvg} alt="logo" />
            <h3>Луна</h3>
          </NavLink>
        </div>
        <div className="header__hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className="glass">
          <NavLink to="/" className="nav__el">Главная</NavLink>
          <NavLink to="/about" className="nav__el">О нас</NavLink>
          <NavLink to="/price" className="nav__el">Тарифы</NavLink>
          <NavLink to="/blog" className="nav__el">Блог</NavLink>
        </nav>
        <div className="auth-wrapper">
          <div className="loading-placeholder">...</div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="header__logo">
        <NavLink to={isAdmin ? "/admin" : "/"} id="logo" onClick={() => setMenuOpen(false)}>
          <img src={logoSvg} alt="logo" />
          <h3>Луна</h3>
        </NavLink>
      </div>

      <div className={`header__hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`glass ${menuOpen ? 'active' : ''}`}>
        {!isAuthenticated && (
          <>
            <NavLink to="/" className="nav__el" onClick={() => setMenuOpen(false)}>
              Главная
            </NavLink>
            <NavLink to="/about" className="nav__el" onClick={() => setMenuOpen(false)}>
              О нас
            </NavLink>
            <NavLink to="/price" className="nav__el" onClick={() => setMenuOpen(false)}>
              Тарифы
            </NavLink>
            <NavLink to="/blog" className="nav__el" onClick={() => setMenuOpen(false)}>
              Блог
            </NavLink>
          </>
        )}

        {isAuthenticated && !isAdmin && (
          <>
            <NavLink to="/" className="nav__el" onClick={() => setMenuOpen(false)}>
              Главная
            </NavLink>
            <NavLink to="/about" className="nav__el" onClick={() => setMenuOpen(false)}>
              О нас
            </NavLink>
            <NavLink to="/price" className="nav__el" onClick={() => setMenuOpen(false)}>
              Тарифы
            </NavLink>
            <NavLink to="/blog" className="nav__el" onClick={() => setMenuOpen(false)}>
              Блог
            </NavLink>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <NavLink to="/blog" className="nav__el" onClick={() => setMenuOpen(false)}>
              Блог
            </NavLink>
            <NavLink to="/admin" className="nav__el " onClick={() => setMenuOpen(false)}>
              Админ-панель
            </NavLink>
          </>
        )}
      </nav>

      <div className="auth-wrapper">
        {isAuthenticated ? (
          <div className="user-controls">
            {isAdmin ? (
              <>
                <span className="user-name-link">
                  <span className="admin-badge"></span>
                  <span className="user-name">Админ</span>
                </span>
                <div className="logout-circle" onClick={handleLogout} title="Выйти">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className="user-name-link" onClick={() => setMenuOpen(false)}>
                  <span className="user-avatar">
                    <img src="/user.svg" alt="user" />
                  </span>
                  <span className="user-name">{user?.name || user?.email?.split('@')[0]}</span>
                </NavLink>
                <div className="logout-circle" onClick={handleLogout} title="Выйти">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </>
            )}
          </div>
        ) : (
          <NavLink to="/auth" className="glass auth-btn" onClick={() => setMenuOpen(false)}>
            Авторизация
          </NavLink>
        )}
      </div>
    </header>
  );
}