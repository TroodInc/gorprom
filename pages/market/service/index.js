import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import { callPostApi, callGetApi, getApiPath, getFullUrl, callDeleteApi } from '../../../helpers/fetch'
import MarketLayout from '../../../layout/market'
import Button, { BUTTON_TYPES, BUTTON_COLORS } from '../../../components/Button'
import Select from '../../../components/Select'
import MarketCard from '../../../components/MarketCard'

import styles from './index.module.css'


const Market = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id, token } = store.authData
  const router = useRouter()
  const { query, pathname, push } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    q: [
      'eq(type,SERVICE)',
      query?.category && `or(eq(category,${query?.category}),eq(category.parent,${query?.category}))`,
    ].filter(Boolean).join(','),
  }
  const product = store.callHttpQuery(custodianApiPath + 'product', { params: productParams })
  const productArray = product.get('data.data') || []

  const productCategoryParams = {
    depth: 4,
  }
  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', { params: productCategoryParams })
  const productCategoryArray = productCategory.get('data.data') || []

  const favoriteEndpoint = custodianApiPath + 'favorite'
  const favoriteParams = {
    q: `eq(employee,${id})`,
    depth: 1,
  }
  const favorite = store.callHttpQuery(favoriteEndpoint, { params: favoriteParams })
  const favoriteArray = favorite.get('data.data') || []

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {productArray.map(item => {
          const fav = favoriteArray.find(f => f.product === item.id)
          return (
            <MarketCard
              key={item.id}
              data={item}
              type="SERVICE"
              host={host}
              isFav={!!fav}
              onFav={() => {
                callPostApi(
                  favoriteEndpoint,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { Authorization: `Token ${token}` } : {}),
                    },
                    body: JSON.stringify({ product: item.id }),
                  },
                )
                  .then(() => store.callHttpQuery(favoriteEndpoint, {
                    params: favoriteParams,
                    cacheTime: 0,
                  }))
              }}
              onFavRemove={() => {
                callDeleteApi(
                  favoriteEndpoint + '/' + fav.id,
                  token ? { headers: { Authorization: `Token ${token}` } } : undefined,
                )
                  .then(() => store.callHttpQuery(favoriteEndpoint, {
                    params: favoriteParams,
                    cacheTime: 0,
                  }))
              }}
            />
          )
        })}
      </div>
      <div className={styles.right}>
        <div className={styles.title}>Категории</div>
        {productCategoryArray.map(item => {
          if (item.childs?.length) {
            const items = [item, ...item.childs]
            return (
              <Select
                key={item.id}
                clearable
                className={classNames(
                  styles.select,
                  items.find(c => c.id === +query?.category) && styles.active,
                )}
                placeholder={item.name}
                items={items.map(c => ({ value: c.id, label: c.name }))}
                values={items.find(c => c.id === +query?.category) ? [+query?.category] : []}
                onChange={vals => {
                  if (vals[0]) {
                    push(`${pathname}?category=${vals[0]}`)
                  } else {
                    push(pathname)
                  }
                }}
              />
            )
          }
          if (!item.parent) {
            return (
              <Button
                key={item.id}
                className={styles.button}
                label={item.name}
                type={BUTTON_TYPES.border}
                color={item.id === +query?.category ? BUTTON_COLORS.orange : BUTTON_COLORS.black}
                onClick={() => {
                  if (item.id === +query?.category) {
                    push(pathname)
                  } else {
                    push(`${pathname}?category=${item.id}`)
                  }
                }}
              />
            )
          }
          return null
        })}
      </div>
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
    q: [
      'eq(type,SERVICE)',
      query?.category && `or(eq(category,${query?.category}),eq(category.parent,${query?.category}))`,
    ].filter(Boolean).join(','),
  }
  const productFullUrl = getFullUrl(custodianApiPath + 'product', productParams)
  const productResponse = await callGetApi(
    productFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const productCategoryParams = {
    depth: 4,
  }
  const productCategoryFullUrl = getFullUrl(custodianApiPath + 'product_category', productCategoryParams)
  const productCategoryResponse = await callGetApi(
    productCategoryFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const fav = {}
  if (user) {
    const favoriteParams = {
      q: `eq(employee,${user})`,
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
          [productCategoryFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: productCategoryResponse,
          },
          ...fav,
        },
      },
    },
  }
}

Market.SubLayout = MarketLayout

export default observer(Market)
