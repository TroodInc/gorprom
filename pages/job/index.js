import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

import Link from '../../components/Link'

import styles from './index.module.css'
import Head from 'next/head'


const Job = () => {
  const { store } = useContext(MobXProviderContext)
  const { id } = store.authData

  if (id) {
    return (
      <div className={styles.root}>
        <Head>
          <title>Горпром | Биржа труда</title>
        </Head>
        <div className={styles.wrapper}>
          Раздел &quot;Биржа труда&quot; сейчас находится в разработке.
          Как только раздел будет готов, мы вышлем уведомление на вашу почту.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Биржа труда</title>
      </Head>
      <div className={styles.wrapper}>
        <span>
          Раздел &quot;Биржа труда&quot; сейчас находится в разработке.
          Чтобы не пропустить дату открытия биржы, пожалуйста{' '}
        </span>
        <Link className={styles.link} href="/registration">
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
