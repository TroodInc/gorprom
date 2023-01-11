import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import CompanyLayout from '../../../../layout/company'

import { callPostApi, callGetApi, getApiPath, getFullUrl, callDeleteApi } from '../../../../helpers/fetch'
import { humanizeNumber } from '../../../../helpers/format'

import Button, { BUTTON_TYPES } from '../../../../components/Button'
import MarketCard from '../../../../components/MarketCard'
import CategoryFilter from '../../../../components/CategoryFilter'

import styles from './index.module.css'
import HiddenContent, { POSITION_TYPES } from '../../../../components/HiddenContent'
import Icon, { ICONS_TYPES } from '../../../../components/Icon'


const CompanyMarket = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id: user, token } = store.authData
  const router = useRouter()
  const { query: { id, type, category, search = '', from }, pathname, push } = router

  const path = pathname.replace('[id]', id)

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    q: [
      `eq(company,${id})`,
      type && type !== 'ALL' && `eq(type,${type})`,
      search.trim() && `like(name,*${search}*)`,
      category && `or(eq(category,${category}),eq(category.parent,${category}))`,
    ].filter(Boolean).join(','),
  }
  const product = store.callHttpQuery(custodianApiPath + 'product', { params: productParams })
  const productArray = product.get('data.data') || []
  const productCount = product.get('data.total_count') || 0

  const productCategoryParams = {
    depth: 1,
  }
  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', { params: productCategoryParams })
  const productCategoryArray = productCategory.get('data.data') || []

  const favoriteEndpoint = custodianApiPath + 'favorite'
  const favoriteParams = {
    q: `eq(employee,${user})`,
    depth: 1,
  }
  const favorite = store.callHttpQuery(favoriteEndpoint, { params: favoriteParams })
  const favoriteArray = favorite.get('data.data') || []

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {!!search && (
          <div className={styles.header}>
            {!productCount && (
              <div>Не найдено совпадений</div>
            )}
            {!!productCount && (
              <div>
                Найдено {humanizeNumber(productCount, 'совпадение', 'совпадения', 'совпадений')}
              </div>
            )}
          </div>
        )}
        {productArray.map(item => {
          const fav = favoriteArray.find(f => f.product === item.id)
          return (
            <MarketCard
              key={item.id}
              data={item}
              type="PRODUCT"
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
      {!search && (
        <>
          <div className={styles.right}>
            <div className={styles.title}>Процессы</div>
            <CategoryFilter
              items={productCategoryArray}
              value={+category}
              onChange={val => {
                if (val) {
                  push(`${path}?category=${val}`)
                } else {
                  push(path)
                }
              }}
            />
          </div>
          <HiddenContent
            className={styles.filter}
            position={POSITION_TYPES.bottomRight}
            ControlComponent={() => (
              <Icon
                size={24}
                type={ICONS_TYPES.filter}
                label="Процессы"
              />)}
          >
            <CategoryFilter
              className={styles.filters}
              items={productCategoryArray}
              value={+category}
              onChange={val => {
                if (val) {
                  push(`${path}?category=${val}`)
                } else {
                  push(path)
                }
              }}
            />
          </HiddenContent>
        </>
      )}
    </div>
  )
}

export async function getServerSideProps({ req, query: { id, type, category, search = '' } }) {
  if (!id || req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const headers = token ? { Authorization: `Token ${token}` } : {}

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  let user

  if (token) {
    const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
    const verifyEndpoint = authApiPath + 'verify-token/'
    try {
      const { data: { data: { id } } } = await callPostApi(verifyEndpoint, { headers })
      user = id
    } catch {}
  }

  const companyFullUrl = getFullUrl(custodianApiPath + 'company/' + id)
  const companyResponse = await callGetApi(companyFullUrl,{ headers }) // QUERY FOR LAYOUT

  const productParams = {
    q: [
      `eq(company,${id})`,
      type && type !== 'ALL' && `eq(type,${type})`,
      search.trim() && `like(name,*${search}*)`,
      category && `or(eq(category,${category}),eq(category.parent,${category}))`,
    ].filter(Boolean).join(','),
  }
  const productFullUrl = getFullUrl(custodianApiPath + 'product', productParams)
  const productResponse = await callGetApi(productFullUrl, { headers })

  const productCategoryParams = {
    depth: 1,
  }
  const productCategoryFullUrl = getFullUrl(custodianApiPath + 'product_category', productCategoryParams)
  const productCategoryResponse = await callGetApi(productCategoryFullUrl, { headers })

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
          [companyFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: companyResponse,
          },
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

CompanyMarket.SubLayout = CompanyLayout

export default observer(CompanyMarket)
