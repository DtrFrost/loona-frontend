import styles from './Footer.module.css'

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
                    <img 
                        src="/ComLogo.svg" 
                        alt="companyLogo" 
                        className={styles.logoIcon}
                    />
                </div>
                <div className={styles.el}>
                    <a href="https://t.me/dtrbublik">
                        <img 
                            src="/logo-tg.svg" 
                            alt="Telegram" 
                            className={styles.socialIcon}
                        />
                    </a>
                    <a href="https://vk.com/dtroriginal">
                        <img 
                            src="/vk-logo.svg" 
                            alt="VK" 
                            className={styles.socialIcon}
                        />
                    </a>
                    <a href="https://github.com/DtrFrost">
                        <img 
                            src="/github-logo.svg" 
                            alt="GitHub" 
                            className={styles.socialIcon}
                        />
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