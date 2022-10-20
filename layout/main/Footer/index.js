import Image from 'next/image'
import Link from '../../../components/Link'
import Icon, { ICONS_TYPES } from '../../../components/Icon'

import styles from './index.module.css'


const Footer = () => {
  return (
    <footer className={styles.root}>
      <Link
        className={styles.logo}
        href="/"
        hideIfNotAllowed
      >
        <Image
          alt="Горпром"
          src="/image/logoLight.svg"
          width={280}
          height={52}
        />
      </Link>
      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <div className={styles.address}>
            Plot No 82, Institutional Area,
            Sector 32, Москва, Россия 122001
          </div>
          <a href="mailto: gor@prom.com" className={styles.email}>
            gor@prom.com
          </a>
          <a href="tel: +79284332233" className={styles.phone}>
            +7 928 433 2233
          </a>
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
                  hideIfNotAllowed
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <Link href="https://vk.com">
            <Icon size={72} type={ICONS_TYPES.vk} className={styles.button} />
          </Link>
          <Link href="https://t.me">
            <Icon size={72} type={ICONS_TYPES.tg} className={styles.button} />
          </Link>
        </div>
        <div className={styles.bottomRight}>
          Copyright © {new Date().getFullYear()} Gorprom
        </div>
      </div>
    </footer>
  )
}

export default Footer
