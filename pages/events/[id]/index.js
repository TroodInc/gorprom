import { Fragment, useContext } from 'react'
import moment from 'moment'
import { MobXProviderContext, observer } from 'mobx-react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Link from '../../../components/Link'
import Button, { BUTTON_TYPES, BUTTON_COLORS } from '../../../components/Button'
import Input, { INPUT_TYPES } from '../../../components/Input'

import styles from './index.module.css'
import NewsCard from '../../../components/NewsCard'
import { callGetApi, getApiPath, getFullUrl } from '../../../helpers/fetch'


const formStoreName = 'subscribe'
const successFormStoreName = 'success'

const NewsItem = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id: user } = store.authData
  const router = useRouter()
  const { query: { id } } = router

  let formStore = store.createFormStore(formStoreName)
  const { form } = formStore

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsItem = store.callHttpQuery(custodianApiPath + 'news/' + id)
  const newsData = newsItem.get('data.data') || { }

  const newsParams = {
    q: `eq(type,EVENT),not(eq(id,${id})),sort(-created),limit(0,3)`,
    only: ['name', 'created', 'photo', 'type'],
  }
  const news = store.callHttpQuery(custodianApiPath + 'news', { params: newsParams })
  const newsArray = news.get('data.data') || []

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Отраслевые мероприятия | {newsData.name}</title>
      </Head>
      <div className={styles.first}>
        <h1 className={styles.title}>{newsData.name}</h1>
        <div className={styles.header}>
          <div className={styles.user}>
            {
              `${newsData.author?.name || ''} ${newsData.author?.surname || ''}`.trim() ||
              `User${newsData.author?.id + 1004367}`
            }
          </div>
          <div className={styles.date}>
            {moment(newsData.created).format('DD.MM.YYYY HH.mm')}
          </div>
        </div>
        {newsData.photo && (
          <div className={styles.imageBlock}>
            <div className={styles.imageWrapper}>
              <Image
                alt={newsData.photo}
                src={newsData.photo}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}
        <div className={styles.text}>
          {newsData.text?.split('\n').map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      </div>
      <div className={styles.second}>
        <Image
          alt="Image"
          src="/image/main/bg.jpg"
          layout="fill"
          objectFit="cover"
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.left}>
              <h2 className={styles.title}>
                Лучшие предложения и проверенные поставщики
              </h2>
            </div>
            <div className={styles.right}>
              <div className={styles.text}>
                Станьте участником крупнейшего маркетплейса добывающей промышленности
              </div>
              {!user && (
                <Button
                  color={BUTTON_COLORS.orange}
                  label="Регистрация"
                  link="/registration"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.third}>
        {!!newsArray.length && (
          <div className={styles.news}>
            <h2 className={styles.title}>
              Отраслевые мероприятия
            </h2>
            <div className={styles.content}>
              {newsArray.map((item, i) => (
                <Fragment key={item.id}>
                  {i > 0 && (<div className={styles.split} />)}
                  <NewsCard data={item} />
                </Fragment>
              ))}
            </div>
            <Button
              className={styles.arrowButton}
              label="Календарь событий"
              link="/events"
            />
          </div>
        )}
        <div className={styles.subscribe}>
          <div className={styles.left}>
            Подписаться на рассылку
          </div>
          <div className={styles.right}>
            <div className={styles.inputWrapper}>
              <Input
                key={form.get('data.tmp')}
                className={styles.input}
                type={INPUT_TYPES.email}
                placeholder="Введите адрес электронной почты"
                validate={{ required: true, checkOnBlur: true }}
                showTextErrors={false}
                value={form.get('data.mail')}
                errors={form.get('errors.mail')}
                onChange={(value) => form.set('data.mail', value)}
                onInvalid={(value) => form.set('errors.mail', value)}
                onValid={() => form.set('errors.mail', [])}
              />
              <Button
                className={styles.button}
                disabled={form.hasErrors}
                type={BUTTON_TYPES.border}
                label={'>'}
                onClick={() => form.submit(custodianApiPath + 'subscriber', 'POST')
                  .then(() => {
                    form.set('data.mail', '')
                    form.set('data.tmp', Date.now())
                    store.createFormStore(successFormStoreName, {
                      modalComponent: 'MessageBox',
                      props: {
                        children: 'Вы успешно подписались на рассылку',
                      },
                    })
                  })}
              />
            </div>
            <div className={styles.disclaimer}>
              <span>Подписываясь, я соглашаюсь на получение новостных/рекламных сообщений на условиях</span>
              <Link href="/agreement">Пользовательского соглашения</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query: { id } }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsItemFullUrl = getFullUrl(custodianApiPath + 'news/' + id)
  const newsItemResponse = await callGetApi(
    newsItemFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const newsParams = {
    q: `eq(type,EVENT),not(eq(id,${id})),sort(-created),limit(0,3)`,
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
          [newsItemFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: newsItemResponse,
          },
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

NewsItem.layoutProps = {
  mainProps: {
    className: styles.layoutMain,
  },
}

export default observer(NewsItem)
