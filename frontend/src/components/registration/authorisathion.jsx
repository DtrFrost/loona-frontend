import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import styles from './Authorisation.module.css';
import Loona from '/src/assets/Loona.svg';

export default function Authorisation() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [agree, setAgree] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const validateRegisterForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Имя обязательно';
        } else if (name.length < 2) {
            newErrors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!email.trim()) {
            newErrors.email = 'Почта обязательна';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен';
        } else if (password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Повторите пароль';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!agree) {
            newErrors.agree = 'Необходимо принять согласие на обработку данных';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLoginForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Введите почту';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!password) {
            newErrors.password = 'Введите пароль';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateLoginForm()) {
            return;
        }

        const result = await login(email, password, rememberMe);

        if (result.success) {
            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            if (result.message === 'Пользователь не найден') {
                setErrors({ email: 'Пользователь с такой почтой не зарегистрирован' });
            } else if (result.message === 'Неверный пароль') {
                setErrors({ password: 'Неверный пароль' });
            } else {
                setServerError(result.message);
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateRegisterForm()) {
            return;
        }

        const result = await register(name, email, password);

        if (result.success) {
            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            if (result.message === 'Пользователь с таким email уже существует') {
                setErrors({ email: 'Этот email уже зарегистрирован' });
            } else {
                setServerError(result.message);
            }
        }
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setErrors({});
        setServerError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setAgree(false);
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setErrors({});
        setServerError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setAgree(false);
    };

    const handleFieldChange = (field, value) => {
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
        switch (field) {
            case 'name': setName(value); break;
            case 'email': setEmail(value); break;
            case 'password': setPassword(value); break;
            case 'confirmPassword': setConfirmPassword(value); break;
        }
    };

    return (
        <div className={styles.wrapperr}>
            <div className={styles.form}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? 'login-image' : 'register-image'}
                        className={styles.imageContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.imageContent}>
                            {isLogin ? (
                                <>
                                    <h2>Войдите в аккаунт</h2>
                                    <h3>и продолжите безопасно и удобно хранить свои файлы, а так же работать с ними</h3>
                                </>
                            ) : (
                                <>
                                    <h2>Зарегистрируйтесь</h2>
                                    <h3>и начните безопасно и удобно хранить свои файлы</h3>
                                </>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.formContainer}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login-form' : 'register-form'}
                            className={styles.motionDiv}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLogin ? (
                                <>
                                    <div className={styles.formHeader}>
                                        <img src={Loona} alt="Месяц" />
                                        <h2>С возвращением!</h2>
                                        <p className={styles.formSubheader}>Авторизуйтесь, чтобы работать со своими файлами и данными</p>
                                    </div>

                                    <form onSubmit={handleLogin}>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="email"
                                                placeholder="Почта"
                                                value={email}
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                                className={errors.email ? styles.error : ''}
                                            />
                                            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <input
                                                type="password"
                                                placeholder="Пароль"
                                                value={password}
                                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                                className={errors.password ? styles.error : ''}
                                            />
                                            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                        </div>

                                        <div className={styles.formOptions}>
                                            <label className={styles.checkboxContainer}>
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <span className={styles.checkmark}></span>
                                                Запомнить меня
                                            </label>

                                            <a href="/forgot-password" className={styles.forgotPassword}>
                                                Забыли пароль?
                                            </a>
                                        </div>

                                        {serverError && <div className={styles.serverError}>{serverError}</div>}

                                        <button type="submit" className={styles.btn}>
                                            Войти
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className={styles.formHeader}>
                                        <img src={Loona} alt="Месяц" />
                                        <h2>Регистрация</h2>
                                    </div>

                                    <form onSubmit={handleRegister}>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="text"
                                                placeholder="Имя"
                                                value={name}
                                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                                className={errors.name ? styles.error : ''}
                                            />
                                            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <input
                                                type="email"
                                                placeholder="Почта"
                                                value={email}
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                                className={errors.email ? styles.error : ''}
                                            />
                                            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <input
                                                type="password"
                                                placeholder="Пароль"
                                                value={password}
                                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                                className={errors.password ? styles.error : ''}
                                            />
                                            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <input
                                                type="password"
                                                placeholder="Подтвердите пароль"
                                                value={confirmPassword}
                                                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                                                className={errors.confirmPassword ? styles.error : ''}
                                            />
                                            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                                        </div>

                                        <label className={`${styles.checkboxContainer} ${errors.agree ? styles.errorCheckbox : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={agree}
                                                onChange={(e) => {
                                                    setAgree(e.target.checked);
                                                    if (errors.agree) {
                                                        setErrors({ ...errors, agree: '' });
                                                    }
                                                }}
                                            />
                                            <span className={styles.checkmark}></span>
                                            Я принимаю согласие на обработку своих данных
                                        </label>
                                        {errors.agree && <span className={`${styles.errorMessage} ${styles.checkboxError}`}>{errors.agree}</span>}

                                        {serverError && <div className={styles.serverError}>{serverError}</div>}

                                        <button type="submit" className={styles.btn}>
                                            Зарегистрироваться
                                        </button>
                                    </form>
                                </>
                            )}

                            <div className={styles.regOr}>
                                <div className={styles.orLine}></div>
                                <span>или</span>
                                <div className={styles.orLine}></div>
                            </div>

                            <div className={styles.orContent}>
                                <button className={`${styles.btn} ${styles.btnGoogle}`}>
                                    <img src="/src/assets/Google.svg" alt="google" />
                                    {isLogin ? 'Войти через Google' : 'Зарегистрироваться через Google'}
                                </button>

                                <span>
                                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                                    <span
                                        className={styles.loginSpan}
                                        onClick={isLogin ? switchToRegister : switchToLogin}
                                    >
                                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                                    </span>
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}