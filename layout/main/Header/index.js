import { useContext } from 'react'
import classNames from 'classnames'
import { MobXProviderContext, observer } from 'mobx-react'
import Image from 'next/image'
import Link from '../../../components/Link'
import Icon, { ICONS_TYPES } from '../../../components/Icon'
import HiddenContent, { POSITION_TYPES } from '../../../components/HiddenContent'

import styles from './index.module.css'


const Header = ({
  className,
  hide,
  theme = 'light',
  layoutProps: {
    authPage,
  } = {},
}) => {
  const { store } = useContext(MobXProviderContext)

  if (hide) return null

  const isAuth = store.authData.id > 0

  return (
    <header className={classNames(styles.root, className, styles[theme])}>
      <div className={styles.container}>
        <HiddenContent
          className={styles.mobileMenu}
          ControlComponent={() => (<Icon size={44} type={ICONS_TYPES.pieMenu} className={styles.pieMenu} />)}
          position={POSITION_TYPES.bottomRight}
        >
          <div className={styles.userMenu}>
            {[
              { link: '/market', label: 'Маркетплейс' },
              { link: '/job', label: 'Биржа труда' },
              { link: '/news', label: 'Новости' },
              { link: '/education', label: 'Образование' },
              { link: 'https://gorprom.org/', label: 'Ассоциация' },
            ].map(({ link, label }) => {
              return (
                <Link
                  key={link}
                  href={link}
                  hideIfNotAllowed
                  className={styles.link}
                  activeClassName={styles.active}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </HiddenContent>
        <Link
          className={styles.logo}
          href="/"
          hideIfNotAllowed
        >
          <Image
            alt="Горпром"
            src={theme === 'light' ? '/image/logoDark.svg' : '/image/logoLight.svg'}
            layout="fill"
            objectFit="contain"
          />
        </Link>
        <div className={styles.menu}>
          {[
            { link: '/market', label: 'Маркетплейс' },
            { link: '/job', label: 'Биржа труда' },
            { link: '/news', label: 'Новости' },
            { link: '/education', label: 'Образование' },
            { link: 'https://gorprom.org/', label: 'Ассоциация' },
          ].map(({ link, label }) => (
            <Link
              key={link}
              href={link}
              hideIfNotAllowed
              className={styles.link}
              activeClassName={styles.active}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className={styles.buttons}>
          {authPage && (
            <Link
              href="/"
              hideIfNotAllowed
              onClick={store.clearAuthData}
            >
              <Icon size={44} type={ICONS_TYPES.close} className={styles.button} />
            </Link>
          )}
          {!authPage && (
            <HiddenContent
              ControlComponent={() => (<Icon size={44} type={ICONS_TYPES.user} className={styles.button} />)}
            >
              <div className={styles.userMenu}>
                {[
                  { link: '/login', label: 'Вход', show: !isAuth },
                  { link: '/registration', label: 'Регистрация', show: !isAuth },
                  { link: '/profile/profile', label: 'Личный кабинет', show: isAuth },
                  { link: '/profile/favorite', label: 'Избранное', show: isAuth },
                  { link: '/profile/request', label: 'Запросы товаров/услуг', show: isAuth },
                  { link: '/', label: 'Выход', action: store.clearAuthData, ssr: true, show: isAuth },
                ].map(({ link, label, show, action, ...other }) => {
                  if (!show) return null
                  return (
                    <Link
                      key={link}
                      href={link}
                      hideIfNotAllowed
                      onClick={action}
                      className={styles.link}
                      activeClassName={styles.active}
                      {...other}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </HiddenContent>
          )}
        </div>
      </div>
    </header>
  )
}

export default observer(Header)
