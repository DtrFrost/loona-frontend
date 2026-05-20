import React from "react";
import { useNavigate } from "react-router-dom";
import NotFounnnd from '/src/assets/404.png';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <img
        src={NotFounnnd}
        alt="404 - Страница не найдена"
        className={styles.image}
      />
      <div className={styles.message}>
        <p>Страницы либо не существует,</p>
        <p>либо её заразили PHP инъекции</p>
      </div>
      <div className={styles.hint}>
        Но не переживайте, мы уже вызвали санитаров
      </div>
      <button
        className={styles.button}
        onClick={() => navigate("/")}
      >
        Вернуться на главную
      </button>
    </div>
  );
}