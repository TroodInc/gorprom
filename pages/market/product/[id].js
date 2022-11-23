import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, Fragment } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { callDeleteApi, callGetApi, callPostApi, getApiPath, getFullUrl } from '../../../helpers/fetch'
import Button, { BUTTON_SPECIAL_TYPES, BUTTON_TYPES, BUTTON_COLORS } from '../../../components/Button'
import Link from '../../../components/Link'
import SubMenu from '../../../components/SubMenu'

import styles from './item.module.css'
import Icon, { ICONS_TYPES } from '../../../components/Icon'


const Product = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id: user, token } = store.authData
  const router = useRouter()
  const { pathname, query: { id, view = 'description' } } = router
  const path = pathname.replace('[id]', id)

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    depth: 3,
  }
  const product = store.callHttpQuery(custodianApiPath + 'product/' + id, { params: productParams })
  const productData = product.get('data.data')

  const favoriteEndpoint = custodianApiPath + 'favorite'
  const favoriteParams = {
    q: `eq(employee,${user}),eq(product,${id})`,
    depth: 1,
  }
  const favorite = store.callHttpQuery(favoriteEndpoint, { params: favoriteParams })
  const favoriteArray = favorite.get('data.data') || []
  const favId = favoriteArray[0]?.id
  const isFavorite = !!favId

  if (!productData) return null

  const openGallery = (startIndex) => () => {
    store.createFormStore('gallery', {
      modalComponent: 'Gallery',
      props: {
        items: productData.photo_set.map(item => item.link),
        startIndex,
      },
    })
  }

  const { category } = productData

  const breadcrumbs = [
    { title: 'Маркетплейс', link: '/market' },
    { title: 'Товары', link: '/market/product' },
  ]
  if (category?.parent) {
    breadcrumbs.push({ title: category.parent.name, link: `/market/product?category=${category.parent.id}` })
  }
  breadcrumbs.push({ title: category.name, link: `/market/product?category=${category.id}` })

  return (
    <div className={styles.root}>
      <div className={styles.breadcrumbs}>
        {breadcrumbs.map((item, i) => (
          <Fragment key={item.link}>
            {!!i && ' > '}
            <Link className={styles.link} href={item.link}>{item.title}</Link>
          </Fragment>
        ))}
      </div>
      <h1 className={styles.title}>{productData.name}</h1>
      <div className={styles.header}>
        <h2>
          <Link className={styles.company} href={`/market/company/${productData.company.id}`}>
            {productData.company.name}
          </Link>
        </h2>
        <Button
          className={styles.favButton}
          type={isFavorite ? BUTTON_TYPES.fill : BUTTON_TYPES.border}
          color={isFavorite ? BUTTON_COLORS.orange : BUTTON_COLORS.black}
          specialType={BUTTON_SPECIAL_TYPES.star}
          label={isFavorite ? 'Сохранено' : 'Сохранить'}
          onClick={() => {
            if (isFavorite) {
              callDeleteApi(
                favoriteEndpoint + '/' + favId,
                token ? { headers: { Authorization: `Token ${token}` } } : undefined,
              )
                .then(() => store.callHttpQuery(favoriteEndpoint, {
                  params: favoriteParams,
                  cacheTime: 0,
                }))
            } else {
              callPostApi(
                favoriteEndpoint,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Token ${token}` } : {}),
                  },
                  body: JSON.stringify({ product: +id }),
                },
              )
                .then(() => store.callHttpQuery(favoriteEndpoint, {
                  params: favoriteParams,
                  cacheTime: 0,
                }))
            }
          }}
        />
      </div>
      <div className={styles.main}>
        {productData.photo_set && !!productData.photo_set.length && (
          <div className={styles.left}>
            <div className={styles.image} onClick={openGallery(0)}>
              <Image
                alt="Photo 1"
                src={productData.photo_set[0].link}
                width={390}
                height={280}
                objectFit="cover"
              />
              <Icon size={70} type={ICONS_TYPES.zoom} className={styles.zoom} />
            </div>
            <div className={styles.gallery}>
              {productData.photo_set.map((item, i) => {
                if (!i) return null
                return (
                  <div key={item.id} className={styles.image} onClick={openGallery(i)}>
                    <Image
                      alt={`Photo ${i + 1}`}
                      src={item.link}
                      width={120}
                      height={120}
                      objectFit="cover"
                    />
                    <Icon size={40} type={ICONS_TYPES.zoom} className={classNames(styles.zoom, styles.smallZoom)} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className={styles.center}>
          <div className={styles.teaser}>
            {productData.teaser}
          </div>
        </div>
        <div className={styles.right}>
          <Button
            label="Отправить запрос"
            onClick={() => {
              const requestFormStoreName = 'requestPRODUCT' + id
              const requestFormStore = store.createFormStore(requestFormStoreName, {
                form: {
                  data: {
                    target: {
                      _object: 'product',
                      id,
                    },
                    message_set: [
                      {
                        text: 'Отправлен запрос',
                      }],
                  },
                },
              })
              requestFormStore.form.submit(custodianApiPath + 'order', 'POST')
                .then(() => router.push('/profile/request'))
            }}
          />
        </div>
      </div>
      <SubMenu
        items={[
          { link: `${path}`, title: 'Описание', scroll: false, activeWithQuery: ['view'] },
          { link: `${path}?view=property`, title: 'Характеристики', scroll: false, activeWithQuery: ['view'] },
        ]}
      />
      {view === 'description' && (
        <div className={styles.description}>
          {(productData.description || '').split('\n')
            .map((text, i) => (
              <p key={i}>{text}</p>
            ))
          }
        </div>
      )}
      {view === 'property' && (
        <div className={styles.properties}>
          {(productData.attribute_set || []).map(item => (
            <div key={item.id} className={styles.property}>
              <div className={styles.propertyName}>{item.name}</div>
              <div className={styles.propertyValue}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps({ req, query }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  let user

  if (token) {
    const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
    const verifyEndpoint = authApiPath + 'verify-token/'
    try {
      const { data: { data: { id } } } =
        await callPostApi(verifyEndpoint, { headers: { Authorization: `Token ${token}` } })
      user = id
    } catch {}
  }

  const productParams = {
    depth: 3,
  }
  const productFullUrl = getFullUrl(custodianApiPath + 'product/' + query.id, productParams)
  const productResponse = await callGetApi(
    productFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const fav = {}
  if (user) {
    const favoriteParams = {
      q: `eq(employee,${user}),eq(product,${query.id})`,
      depth: 1,
    }
    const favoriteFullUrl = getFullUrl(custodianApiPath + 'favorite', favoriteParams)
    const favoriteResponse = await callGetApi(
      favoriteFullUrl,
      token ? { headers: { Authorization: `Token ${token}` } } : undefined,
    )

    fav[favoriteFullUrl] = {
      callTime: Date.now(),
      loaded: true,
      response: favoriteResponse,
    }
  }

  return {
    props: {
      initialStore: {
        httpQuery: {
          [productFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: productResponse,
          },
          ...fav,
        },
      },
    },
  }
}

export default observer(Product)
