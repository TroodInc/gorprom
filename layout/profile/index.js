import SubMenu from '../../components/SubMenu'

import styles from './index.module.css'


const ProfileLayout = ({ children }) => {
  return (
    <>
      <h1 className={styles.title}>Личный кабинет</h1>
      <SubMenu
        className={styles.menu}
        items={[
          { link: '/profile/profile', title: 'Профиль' },
          { link: '/profile/requests', title: 'Запросы товаров/услуг' },
          { link: '/profile/organization', title: 'Управление организацией' },
        ]}
      />
      {children}
    </>
  )
}

export default ProfileLayout
