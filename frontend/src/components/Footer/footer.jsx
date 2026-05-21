import styles from './Footer.module.css'
import ComLogo from '/src/public/ComLogo.svg';
import Tg from '/src/public/logo-tg.svg';
import Vk from '/src/public/vk-logo.svg';
import Github from '/src/public/github-logo.svg';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.version}>
                <div className={styles.versionCh}>
                    <h3>Бета 0.1</h3>
                </div>
                <span className={styles.tooltipText}>
                    Текущая версия: Бета 0.1
                </span>
            </div>
            <div className={styles.links}>
                <div className={styles.el}>
                    <img src={ComLogo} alt="logo" />
                </div>
                <div className={styles.el}>
                    <a href="https://t.me/dtrbublik">
                        <img src={Tg} alt="logo" />
                    </a>
                    <a href="https://vk.com/dtroriginal">
                        <img src={Vk} alt="logo" />
                    </a>
                    <a href="https://github.com/DtrFrost">
                        <img src={Github} alt="logo" />
                    </a>
                </div>
                <div className={styles.info}>
                    <span>© 2025–2026 ООО "Блайнд"</span>
                    <span>Все права защищены</span>
                </div>
            </div>
        </footer>
    )
}