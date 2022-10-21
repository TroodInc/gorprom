import { observer } from 'mobx-react'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'


const Profile = ({ account: { profile = {} } = {} }) => (
  <div className={styles.root}>
    <div className={classNames(styles.column, styles.left)}>
      <Image
        src={profile.avatar || '/image/defaultAvatar.jpg'}
        height={300}
        width={300}
        style={{
          borderRadius: '50%',
        }}
      />
    </div>
    <div className={styles.column}>
      <div className={styles.block}>
        <div className={styles.title}>
          Имя
        </div>
        <div className={styles.value}>
          {profile.name}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Фамилия
        </div>
        <div className={styles.value}>
          {profile.surname}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Отчество
        </div>
        <div className={styles.value}>
          {profile.patronymic}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Должность
        </div>
        <div className={styles.value}>
          {profile.position}
        </div>
      </div>
    </div>
    <div className={styles.column}>
      <div className={styles.block}>
        <div className={styles.title}>
          Почта
        </div>
        <div className={styles.value}>
          {profile.mail}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Дополнительная почта
        </div>
        <div className={styles.value}>
          {profile.additional_mail}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Телефон
        </div>
        <div className={styles.value}>
          {profile.phone}
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.title}>
          Место работы (организация)
        </div>
        <div className={styles.value}>
          {profile.company?.name}
        </div>
      </div>
    </div>
  </div>
)

Profile.SubLayout = ProfileLayout

export default observer(Profile)
