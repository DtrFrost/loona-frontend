import React from "react"
import { NavLink } from "react-router-dom";
import AnimatedLock from "../Animations/AnimatedLock/animatedlock"
import DevicesConnection from "../Animations/DevicesConnection/devicesconnection"
import PuzzleIcon from "../Animations/PuzzleIcon/puzzleicon"
import styles from "./MainInfo.module.css"

export default function MainInfo() {
    return (
        <div className={styles.mainInfo}>
            <div className={styles.text}>
                <h1>Луна сервис</h1>
                <p className={styles.textParagraph}>
                    Храните и работайте с вашими файлами безопасно и в одном месте
                </p>
            </div>
            
            <div className={styles.promis}>
                <div className={styles.promisEl}>
                    <AnimatedLock />
                    <h4>Безопасное хранение ваших данных</h4>
                </div>
                <div className={styles.promisEl}>
                    <DevicesConnection />
                    <h4>Доступ с любого устройства</h4>
                </div>
                <div className={styles.promisEl}>
                    <PuzzleIcon />
                    <h4>Наш сервис прост в использовании</h4>
                </div>
            </div>
            
            <div className={styles.tryText}>
                начните <span className={styles.free}>БЕСПЛАТНО</span> 
                {' '}и получите{' '}
                <span className={styles.weight}>5ГБ</span> пространства для старта
            </div>
            
            <div className={styles.btn}>
                <button className={styles.button}>
                    <NavLink to="/auth">
                        Попробовать
                    </NavLink>
                </button>
            </div>
        </div>
    )
}