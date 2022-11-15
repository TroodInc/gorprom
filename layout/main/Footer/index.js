import classNames from 'classnames'
import Image from 'next/image'
import Link from '../../../components/Link'
import Icon, { ICONS_TYPES } from '../../../components/Icon'

import styles from './index.module.css'
import Button, { BUTTON_TYPES } from '../../../components/Button'


const Footer = ({ className, hide }) => {
  if (hide) return null
  return (
    <footer className={classNames(styles.root, className)}>
      <div className={styles.top}>
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
        <Image
          alt="Горнопромышленники России"
          src="/image/logoFooter.svg"
          width={78}
          height={78}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <div className={styles.phoneLabel}>техническая поддержка</div>
          <a href="tel: +79284332233" className={styles.phone}>
            +7 928 433 2233
          </a>
          <Button
            className={styles.registrationBtn}
            label="Зарегистрироваться"
            type={BUTTON_TYPES.fill}
            link={'/registration'}
          />
        </div>
        <div className={styles.mainRight}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>О платформе</div>
            <div className={styles.links}>
              {[
                { link: '/market', label: 'Маркетплейс' },
                { link: '/job', label: 'Биржа труда' },
                { link: '/analytics', label: 'Аналитика' },
                { link: '/education', label: 'Образование и научная работа' },
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
            <div className={styles.blockTitle}>Об Ассоциации</div>
            <div className={styles.links}>
              {[
                { link: '/association/activity', label: 'Деятельность' },
                { link: '/association/events', label: 'Мероприятия' },
                { link: '/association/news', label: 'Новости' },
                { link: '/association/contacts', label: 'Контакты' },
              ].map(({ link, label }) => (
                <Link
                  key={link}
                  href={link}
                  hideIfNotAllowed
                >
                  {label}
                </Link>
              ))}
              <div className={styles.socials}>
                <Link href="https://vk.com">
                  <Icon size={44} type={ICONS_TYPES.vk} className={styles.socialLink} />
                </Link>
                <Link href="https://t.me">
                  <Icon size={44} type={ICONS_TYPES.tg} className={styles.socialLink} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.copy}>
          &copy;&nbsp;{new Date().getFullYear()} Ассоциация &laquo;НП&nbsp;&laquo;Горнопромышленники России&raquo;
        </div>
        <Link href={'/personal'} className={styles.bottomLink}>
          Политика обработки персональных данных
        </Link>
        <Link href={'/agreement'} className={styles.bottomLink}>
          Пользовательское соглашение
        </Link>
      </div>
    </footer>
  )
}

export default Footer
