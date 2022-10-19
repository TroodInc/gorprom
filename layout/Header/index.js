import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import Image from '../../components/Image'
import Link from '../../components/Link'
import Icon, { ICONS_TYPES } from '../../components/Icon'
import HiddenContent from '../../components/HiddenContent'

import styles from './index.module.css'


const Header = () => {
  const { store } = useContext(MobXProviderContext)

  const isAuth = store.authData.id > 0

  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <Link
          href="/"
          hideIfNotAllowed
        >
          <Image className={styles.logo} alt="Горпром" url="/image/logoDark.svg" />
        </Link>
        <div className={styles.menu}>
          {[
            { link: '/market', label: 'Маркетплейс' },
            { link: '/association', label: 'Ассоциация' },
            { link: '/niokr', label: 'НИОКР' },
            { link: '/education', label: 'Обучение' },
            { link: '/job', label: 'Биржа труда' },
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
        <div className={styles.buttons}>
          <Icon size={72} type={ICONS_TYPES.search} className={styles.button} />
          <HiddenContent
            control={(<Icon size={72} type={ICONS_TYPES.user} className={styles.button} />)}
          >
            <div className={styles.userMenu}>
              {[
                { link: '/login', label: 'Вход', show: !isAuth },
                { link: '/registration', label: 'Регистрация', show: !isAuth },
                { link: '/profile', label: 'Личный кабинет', show: isAuth },
                { link: '/', label: 'Выход', show: isAuth, action: store.clearAuthData },
              ].map(({ link, label, show, action }) => {
                if (!show) return null
                return (
                  <Link
                    key={link}
                    href={link}
                    hideIfNotAllowed
                    onClick={action}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </HiddenContent>
        </div>
      </div>
    </header>
  )
}

export default observer(Header)
