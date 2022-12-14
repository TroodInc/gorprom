import { Fragment, useContext, useState } from 'react'
import classNames from 'classnames'
import { MobXProviderContext, observer } from 'mobx-react'
import Image from 'next/image'

import Link from '../components/Link'
import ImageSlider from '../components/ImageSlider'
import Button, { BUTTON_TYPES, BUTTON_COLORS } from '../components/Button'
import Input, { INPUT_TYPES } from '../components/Input'

import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../components/Icon'
import { callGetApi, getApiPath, getFullUrl } from '../helpers/fetch'
import NewsCard from '../components/NewsCard'


const market = [
  {
    link: '/market/company',
    title: 'Компании',
    image: '/image/main/company.jpg',
    action: 'Поиск компании',
  },
  {
    link: '/market/product',
    title: 'Оборудование',
    image: '/image/main/product.jpg',
    action: 'Поиск оборудования',
  },
  {
    link: '/market/service',
    title: 'Услуги',
    image: '/image/main/service.jpg',
    action: 'Поиск услуги',
  },
]

const companies = [
  {
    name: 'Северсталь',
    logo: '/image/company/severstal.png',
  },
  {
    name: 'Норникель',
    logo: '/image/company/nornikel.png',
  },
  {
    name: 'Уралкалий',
    logo: '/image/company/uralkaliy.png',
  },
  {
    name: 'СЗНК',
    logo: '/image/company/sznk.png',
  },
  {
    name: 'Somex',
    logo: '/image/company/somex.png',
  },
  {
    name: 'Лукойл-Коми',
    logo: '/image/company/lukoil.png',
  },
]

const getCompanies = (index, count) => {
  return Array(count).fill(0)
    .map((_, i) => {
      let company = index + i
      while (company > companies.length - 1) {
        company = company - companies.length
      }
      return companies[company]
    })
}

const flowByType = {
  PROM: [
    {
      icon: ICONS_TYPES.registrationStep,
      text: 'Регистрация на платформе',
    },
    {
      icon: ICONS_TYPES.selectStep,
      text: 'Выбор товара/услуги/поставщика',
    },
    {
      icon: ICONS_TYPES.sendRequestStep,
      text: 'Отправка запроса',
    },
    {
      icon: ICONS_TYPES.orderStep,
      text: 'Заключение сделки',
    },
  ],
  SUPPLY: [
    {
      icon: ICONS_TYPES.registrationStep,
      text: 'Регистрация на платформе',
    },
    {
      icon: ICONS_TYPES.uploadStep,
      text: 'Загрузка каталога',
    },
    {
      icon: ICONS_TYPES.getRequestStep,
      text: 'Получение запросов',
    },
    {
      icon: ICONS_TYPES.orderStep,
      text: 'Заключение сделки',
    },
  ],
}

const formStoreName = 'subscribe'
const successFormStoreName = 'success'

const Main = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id } = store.authData

  let formStore = store.createFormStore(formStoreName)
  const { form } = formStore

  const [company, setCompany] = useState(0)
  const prevCompany = company - 1 < 0 ? companies.length - 1 : company - 1
  const nextCompany = company + 1 > companies.length - 1 ? 0 : company + 1

  const [howType, setHowType] = useState('PROM')

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsParams = {
    q: 'eq(type,NEWS),sort(-created),limit(0,5)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const news = store.callHttpQuery(custodianApiPath + 'news', {
    params: newsParams,
    cacheTime: 3000,
  })
  const newsArray = news.get('data.data') || []

  const eventParams = {
    q: 'eq(type,EVENT),sort(-created),limit(0,3)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const event = store.callHttpQuery(custodianApiPath + 'news', {
    params: eventParams,
    cacheTime: 3000,
  })
  const eventArray = event.get('data.data') || []

  return (
    <div className={styles.root}>
      <ImageSlider className={styles.gallery} items={[
        '/image/slider/1.jpg',
        '/image/slider/2.jpg',
        '/image/slider/3.jpg',
        '/image/slider/4.jpg',
      ]}>
        <div className={styles.header}>
          <h2 className={styles.title}>Маркетплейс горной промышленности</h2>
          {!id && (
            <Button
              className={styles.reg}
              label="Регистрация"
              type={BUTTON_TYPES.border}
              color={BUTTON_COLORS.white}
              link={'/registration'}
            />
          )}
        </div>
      </ImageSlider>
      <div className={styles.first}>
        <div className={styles.about}>
          <h2 className={styles.title}>О платформе</h2>
          <div className={styles.text}>
            Добро пожаловать на платформу, позволяющую горнодобывающим компаниям сокращать издержки на закупках
            и упрощать свои бизнес-процессы, а поставщикам — иметь прямой доступ к заказам промышленных компаний
          </div>
        </div>
        <div className={styles.market}>
          {market.map(item => (
            <Link key={item.link} className={styles.marketBlock} href={item.link}>
              <h3 className={styles.marketTitle}>{item.title}</h3>
              <div className={styles.imageWrapper}>
                <Image
                  alt={item.link}
                  src={item.image}
                  layout="fill"
                  objectFit="cover"
                />
                <div className={styles.action}>{item.action}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.second}>
        <h2 className={styles.title}>Участники</h2>
        <div className={styles.companies}>
          <Icon type={ICONS_TYPES.arrow} className={styles.prev} onClick={() => setCompany(prevCompany)} />
          {getCompanies(company, 3).map((item, i) => (
            <div key={item.name} className={classNames(styles.company, styles[`item${i}`])}>
              <h3 className={styles.companyName}>
                {item.name}
              </h3>
              <div className={styles.imageWrapper}>
                <Image
                  alt={item.link}
                  src={item.logo}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ))}
          <Icon type={ICONS_TYPES.arrow} className={styles.next} onClick={() => setCompany(nextCompany)} />
        </div>
        <div className={styles.buttons}>
          <Button
            label="Все компании"
            link="/market/company"
          />
          {!id && (
            <Button
              type={BUTTON_TYPES.border}
              label="Регистрация"
              link="/registration"
            />
          )}
        </div>
      </div>
      <div className={styles.third}>
        <h2 className={styles.title}>
          Как работает маркетплейс?
        </h2>
        <div className={styles.menu}>
          <div
            className={classNames(styles.menuItem, howType === 'PROM' && styles.active)}
            onClick={() => setHowType('PROM')}
          >
            Для горнопромышленников
          </div>
          <div
            className={classNames(styles.menuItem, howType === 'SUPPLY' && styles.active)}
            onClick={() => setHowType('SUPPLY')}
          >
            Для поставщиков
          </div>
        </div>
        <div className={styles.flow}>
          {(flowByType[howType] || []).map((item, i) => (
            <Fragment key={item.icon}>
              {!!i && (
                <Icon
                  type={ICONS_TYPES.arrowWithTail}
                  className={styles.flowArrow}
                />
              )}
              <div className={styles.flowStep}>
                <Icon
                  type={item.icon}
                  size={80}
                  className={styles.flowIcon}
                />
                <div className={styles.flowText}>
                  {item.text}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className={styles.fourth}>
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
              {!id && (
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
      <div className={styles.fifth}>
        {!!newsArray.length && (
          <div className={styles.news}>
            <h2 className={styles.title}>
              Новости
            </h2>
            <div className={classNames(styles.content, styles.row0)}>
              <NewsCard big data={newsArray[0]} className={styles.item0} />
              {newsArray.length > 1 && (
                <>
                  <div className={styles.split} />
                  <NewsCard className={styles.item1} data={newsArray[1]} />
                </>
              )}
              {newsArray.length > 2 && (
                <>
                  <div className={classNames(styles.split, styles.item2)} />
                  <NewsCard className={styles.item2} data={newsArray[2]} />
                </>
              )}
            </div>
            {newsArray.length > 2 && (
              <div className={classNames(styles.content, styles.row1)}>
                {newsArray.map((item, i) => {
                  if (i < 2) return null
                  return (
                    <Fragment key={item.id}>
                      {i > 2 && (<div className={styles.split} />)}
                      <NewsCard data={item} />
                    </Fragment>
                  )
                })}
              </div>
            )}
            <Button
              className={styles.arrowButton}
              label="Другие новости"
              link="/news"
            />
          </div>
        )}
        {!!eventArray.length && (
          <div className={styles.news}>
            <h2 className={styles.title}>
              Отраслевые мероприятия
            </h2>
            <div className={styles.content}>
              {eventArray.map((item, i) => (
                <Fragment key={item.id}>
                  {!!i && (<div className={styles.split} />)}
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

export async function getServerSideProps({ req, query }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const newsParams = {
    q: 'eq(type,NEWS),sort(-created),limit(0,5)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const newsFullUrl = getFullUrl(custodianApiPath + 'news', newsParams)
  const newsResponse = await callGetApi(
    newsFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const eventParams = {
    q: 'eq(type,EVENT),sort(-created),limit(0,3)',
    only: ['name', 'created', 'photo', 'type'],
  }
  const eventFullUrl = getFullUrl(custodianApiPath + 'news', eventParams)
  const eventResponse = await callGetApi(
    eventFullUrl,
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
          [eventFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: eventResponse,
          },
        },
      },
    },
  }
}

Main.layoutProps = {
  headerProps: {
    className: styles.layoutHeader,
    theme: 'dark',
  },
  mainProps: {
    className: styles.layoutMain,
  },
}

export default observer(Main)
