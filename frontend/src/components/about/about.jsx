import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./About.module.css";

export default function About() {
    return (
        <div className={styles.aboutContainer}>

            <div className={`${styles.section} ${styles.hero}`}>
                <h1>Луна —</h1>
                <h1>облачное хранилище нового поколения</h1>
                <span>
                    Мы создаём простой, быстрый и безопасный способ хранить ваши файлы 
                    и получать к ним доступ в любой момент.
                </span>
            </div>

            <div className={`${styles.section} ${styles.args}`}>
                <div>
                    <h2>О нас</h2>
                    <span>
                        Луна — это современный сервис облачного хранения, созданный с целью 
                        сделать работу с файлами максимально удобной. Мы верим, что доступ 
                        к информации должен быть простым, быстрым и безопасным для каждого пользователя.
                    </span>
                </div>
                <div>
                    <h2>Почему Луна?</h2>
                    <span>
                        Большинство облачных сервисов перегружены сложными функциями и неудобными 
                        интерфейсами. Мы решили создать минималистичное и понятное решение, которое 
                        позволяет сосредоточиться на главном — ваших файлах.
                    </span>
                </div>
                <div>
                    <h2>Мы заботимся о ваших данных</h2>
                    <span>
                        Каждый файл, загруженный в Луна, надёжно защищён. Мы используем современные 
                        методы защиты, чтобы гарантировать безопасность и конфиденциальность вашей информации.
                    </span>
                </div>
            </div>

            <div className={`${styles.section} ${styles.advantages}`}>
                <h2>Преимущества</h2>
                <div className={styles.advanGrid}>
                    <div className={styles.advanEl}>
                        <h3>Безопасность</h3>
                        <p>Ваши файлы защищены современными технологиями шифрования</p>
                    </div>
                    <div className={styles.advanEl}>
                        <h3>Скорость</h3>
                        <p>Моментальный доступ к данным из любой точки мира</p>
                    </div>
                    <div className={styles.advanEl}>
                        <h3>Простота</h3>
                        <p>Чистый интерфейс без лишних деталей</p>
                    </div>
                    <div className={styles.advanEl}>
                        <h3>Доступность</h3>
                        <p>Работает на всех устройствах и платформах</p>
                    </div>
                </div>
            </div>

            <div className={styles.start}>
                <h2>Начните пользоваться Луной прямо сейчас</h2>
                <button className={styles.button}>
                    <NavLink to="/auth">Создать аккаунт</NavLink>
                </button>
            </div>
        </div>
    );
}