import SubMenu from '../../components/SubMenu'

import styles from './index.module.css'


const ProfileLayout = ({ children }) => {
  return (
    <>
      <h1 className={styles.title}>Личный кабинет</h1>
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
