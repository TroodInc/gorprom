import { MobXProviderContext, observer } from 'mobx-react'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'
import { useContext } from 'react'
import { getApiPath } from '../../../helpers/fetch'


const Profile = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { profile = {} } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const company = profile.company && store.callHttpQuery(custodianApiPath + 'company/' + profile.company, {
    params: {
      only: ['name', 'ownership_type', 'ownership_type.name'],
    },
  })

  const companyName = company?.loaded ?
    ((company.get('data.data.ownership_type.name') || '') + ' ' + (company.get('data.data.name') || '')).trim() :
    undefined

  return (
    <div className={styles.root}>
      <div className={classNames(styles.column, styles.left)}>
        <Image
          src={profile.avatar || '/image/defaultAvatar.jpg'}
          height={300}
          width={300}
          style={{
            borderRadius: '50%',
          }}
          objectFit="cover"
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
            {companyName}
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.SubLayout = ProfileLayout

Profile.layoutProps = {
  profilePage: true,
}

export default observer(Profile)
