import { useRouter } from 'next/router'

import SubMenu from '../../components/SubMenu'
import Icon, { ICONS_TYPES } from '../../components/Icon'

import styles from './index.module.css'
import Head from 'next/head'
import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'


const ProfileLayout = ({ children, editable }) => {
  const { push } = useRouter()
  const { store } = useContext(MobXProviderContext)
  const { profile: { company } = {} } = store.authData

  return (
    <>
      <Head>
        <title>Горпром | Личный кабинет</title>
      </Head>
      <div className={styles.header}>
        <h1 className={styles.title}>Личный кабинет</h1>
        {editable && (
          <Icon
            className={styles.pencil}
            size={32}
            type={ICONS_TYPES.pencil}
            onClick={() => push('/profile/profile/edit')}
          />
        )}
      </div>
      <SubMenu
        className={styles.menu}
        items={[
          {
            link: '/profile/profile',
            title: 'Профиль',
          },
          {
            link: '/profile/request',
            title: 'Запросы товаров/услуг',
          },
          {
            link: '/profile/favorite',
            title: 'Избранное',
          },
          company && {
            link: '/profile/organization',
            title: 'Управление организацией',
            subItems: [
              {
                link: '',
                title: 'Профиль организации',
                exact: true,
              },
              {
                link: '/requisites',
                title: 'Финансовая информация',
              },
              {
                link: '/products',
                title: 'Товары',
              },
            ],
          },
          !company && {
            link: '/profile/organization',
            title: 'Управление организацией',
          },
        ].filter(Boolean)}
      />
      {children}
    </>
  )
}

export default ProfileLayout
