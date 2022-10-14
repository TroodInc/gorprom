import Image from '../../components/Image'
import Link from '../../components/Link'

import styles from './index.module.css'


const Footer = ({ abacContext, abacRules }) => {
  return (
    <footer className={styles.root}>
      <Image className={styles.logo} alt="Горпром" url="/image/logoLight.svg" />
      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <div className={styles.address}>
            Plot No 82, Institutional Area,
            Sector 32, Москва, Россия 122001
          </div>
          <div className={styles.email}>
            gor@prom.com
          </div>
          <div className={styles.phone}>
            +7 928 433 2233
          </div>
        </div>
        <div className={styles.mainRight}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>О нас</div>
            <div className={styles.links}>
              {[
                { link: '/about/platform', label: 'Платформа' },
                { link: '/about/history', label: 'История' },
                { link: '/about/mission', label: 'Миссия' },
                { link: '/about/contacts', label: 'Контакты' },
              ].map(({ link, label }) => (
                <Link
                  key={link}
                  href={link}
                  context={abacContext}
                  rules = {abacRules}
                  hideIfNotAllowed
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>Маркетплейс</div>
            <div className={styles.links}>
              {[
                { link: '/market/brands', label: 'Бренды' },
                { link: '/market/equipment', label: 'Оборудование' },
                { link: '/market/terms', label: 'Пользовательское соглашение' },
                { link: '/market/pricing', label: 'Ценообразование' },
                { link: '/market/licensing', label: 'Лицензирование' },
              ].map(({ link, label }) => (
                <Link
                  key={link}
                  href={link}
                  context={abacContext}
                  rules = {abacRules}
                  hideIfNotAllowed
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p>© {new Date().getFullYear()}, Built with</p>
    </footer>
  )
}

export default Footer
