import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

import NewsCard from '../../components/NewsCard'

import styles from './index.module.css'
import { callGetApi, getApiPath, getFullUrl } from '../../helpers/fetch'


const EventList = ({ host }) => {
  const { store } = useContext(MobXProviderContext)

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsParams = {
    q: 'eq(type,EVENT),sort(-created)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const news = store.callHttpQuery(custodianApiPath + 'news', { params: newsParams })
  const newsArray = news.get('data.data') || []
  const newsRows = Array(Math.ceil(newsArray.length / 3)).fill(0)

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>
        Отраслевые мероприятия
      </h1>
      {newsRows.map((_, i) => {
        const item1 = newsArray[i * 3]
        const item2 = newsArray[i * 3 + 1]
        const item3 = newsArray[i * 3 + 2]
        return (
          <div key={item1.id} className={styles.content}>
            <NewsCard data={item1} />
            <div className={styles.split} />
            <NewsCard data={item2} />
            <div className={styles.split} />
            <NewsCard data={item3} />
          </div>
        )
      })}
    </div>
  )
}

export async function getServerSideProps({ req, query: { id } }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsParams = {
    q: 'eq(type,EVENT),sort(-created)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const newsFullUrl = getFullUrl(custodianApiPath + 'news', newsParams)
  const newsResponse = await callGetApi(
    newsFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  return {
    props: {
      initialStore: {
        httpQuery: {
          [newsFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: newsResponse,
          },
        },
      },
    },
  }
}

export default observer(EventList)
