import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'
import { getApiPath } from '../../../helpers/fetch'
import { toPhone } from '../../../helpers/format'


const Profile = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { profile = {} } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const company = profile.company && store.callHttpQuery(custodianApiPath + 'company/' + profile.company, {
    params: {
      only: ['name', 'ownership_type', 'ownership_type.name'],
    },
  })

  const isSubscribed = profile.subscribe

  return (
    <div className={styles.root}>
      <div className={classNames(styles.column, styles.left)}>
        <Image
          alt="Avatar"
          src={profile.avatar || '/image/defaultAvatar.jpg'}
          height={172}
          width={172}
          style={{
            borderRadius: '50%',
          }}
          objectFit="cover"
        />
      </div>
      <div className={styles.right}>
        <div className={styles.columns}>
          <div className={styles.column}>
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
                Имя
              </div>
              <div className={styles.value}>
                {profile.name}
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
                {profile.phone && '+' + toPhone(profile.phone)}
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.title}>
                Место работы (организация)
              </div>
              <div className={styles.value}>
                {company.get('data.data.name')}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mailingHeader}>
           Подписка на рассылку { !isSubscribed && 'не' } оформлена
        </div>
      </div>
    </div>
  )
}

Profile.layoutProps = {
  profilePage: true,
}

Profile.SubLayout = ProfileLayout

Profile.subLayoutProps = {
  editable: true,
}

export default observer(Profile)
