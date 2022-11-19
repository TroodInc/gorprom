import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

import Link from '../../components/Link'

import styles from './index.module.css'


const Job = () => {
  const { store } = useContext(MobXProviderContext)
  const { id } = store.authData

  if (id) {
    return (
      <div className={styles.root}>
        <div className={styles.wrapper}>
          Раздел биржа труда сейчас находится в разработке,
          как только раздел будет готов, мы вышлем уведомление на вашу почту.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <span>
          Раздел биржа труда сейчас находится в разработке,
          для того, чтобы не пропустить дату открытия биржы, пожалуйста
        </span>
        <Link href="/registration">
          Зарегистрируйтесь
        </Link>
        <span>
          , мы вышлем уведомление на вашу почту.
        </span>
      </div>
    </div>
  )
}

export default observer(Job)
