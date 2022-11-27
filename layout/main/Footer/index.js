import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from '../../../components/Link'
import Icon, { ICONS_TYPES } from '../../../components/Icon'

import styles from './index.module.css'
import Button, { BUTTON_TYPES, BUTTON_COLORS } from '../../../components/Button'


const Footer = ({ className, hide }) => {
  const { store } = useContext(MobXProviderContext)
  const { id } = store.authData
  if (hide) return null
  return (
    <footer className={classNames(styles.root, className)}>
      <div className={styles.top}>
        <div className={styles.left}>
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
          <div className={styles.supportLabel}>Техническая поддержка</div>
          <a href="mailto:support@gorprom.market" className={styles.supportContact}>
            support@gorprom.market
          </a>
        </div>
        <div className={styles.right}>
          <Image
            alt="Горнопромышленники России"
            src="/image/logoFooter.svg"
            width={140}
            height={140}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.left}>
          {!id && (
            <Button
              className={styles.regButton}
              color={BUTTON_COLORS.orange}
              label="Зарегистрироваться"
              type={BUTTON_TYPES.fill}
              link={'/registration'}
            />
          )}
        </div>
        <div className={styles.right}>
          <div className={styles.block}>
            <div className={styles.blockTitle}>О платформе</div>
            <div className={styles.links}>
              {[
                { link: '/market', label: 'Маркетплейс' },
                { link: '/job', label: 'Биржа труда' },
                { link: '/news', label: 'Новости' },
                { link: '/education', label: 'Образование' },
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
                // eslint-disable-next-line max-len
                { link: 'https://gorprom.org/%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BC%D0%B5%D1%80%D0%BE%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F-2022/', label: 'Деятельность' },
                { link: 'https://gorprom.org/', label: 'Мероприятия' },
                { link: 'https://gorprom.org/', label: 'Новости' },
                { link: 'https://gorprom.org/%d0%ba%d0%be%d0%bd%d1%82%d0%b0%d0%ba%d1%82%d1%8b/', label: 'Контакты' },
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
                <Link href="https://vk.com/gorprom_org">
                  <Icon size={44} type={ICONS_TYPES.vk} className={styles.socialLink} />
                </Link>
                <Link href="https://t.me//gorprom">
                  <Icon size={44} type={ICONS_TYPES.tg} className={styles.socialLink} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <div>При поддержке:</div>
          <div className={styles.sponsor}>
            <Image
              alt="Минпромторг"
              src="/image/minpromtorg.png"
              width={132}
              height={65}
            />
            <Image
              alt="ТПП"
              src="/image/tpp.png"
              width={112}
              height={65}
            />
          </div>
        </div>
        <div className={styles.right}>
          <Link href={'/personal'} className={styles.bottomLink}>
            Политика обработки персональных данных
          </Link>
          <Link href={'/agreement'} className={styles.bottomLink}>
            Пользовательское соглашение
          </Link>
          <div className={styles.copy}>
            &copy; {new Date().getFullYear()} Ассоциация &#34;НП &#34;Горнопромышленники России&#34;
          </div>
        </div>
      </div>
    </footer>
  )
}

export default observer(Footer)
