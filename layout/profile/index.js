import { useRouter } from 'next/router'

import SubMenu from '../../components/SubMenu'
import Icon, { ICONS_TYPES } from '../../components/Icon'

import styles from './index.module.css'


const ProfileLayout = ({ children, editable }) => {
  const { push } = useRouter()

  return (
    <>
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
          {
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
        ]}
      />
      {children}
    </>
  )
}

export default ProfileLayout
