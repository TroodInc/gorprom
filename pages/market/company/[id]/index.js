import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import CompanyLayout from '../../../../layout/company'

import { callGetApi, getApiPath, getFullUrl } from '../../../../helpers/fetch'
import Button, { BUTTON_COLORS, BUTTON_TYPES } from '../../../../components/Button'
import MarketCard from '../../../../components/MarketCard'
import Select from '../../../../components/Select'

import styles from './index.module.css'
import { humanizeNumber } from '../../../../helpers/format'


const TYPES = [
  { value: 'PRODUCT', label: 'Товары' },
  { value: 'SERVICE', label: 'Услуги' },
]

const CompanyMarket = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
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
    depth: 4,
  }
  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', { params: productCategoryParams })
  const productCategoryArray = productCategory.get('data.data') || []

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
            <Button
              className={styles.button}
              label="отменить"
              type={BUTTON_TYPES.text}
              onClick={() => push(from || path)}
            />
          </div>
        )}
        {productArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="PRODUCT"
            showType
          />
        ))}
      </div>
      <div className={styles.right}>
        {!search && (
          <>
            <div className={styles.title}>Фильтры</div>
            <Select
              clearable
              className={classNames(
                styles.select,
                TYPES.find(c => c.value === type) && styles.active,
              )}
              placeholder="Тип"
              items={TYPES}
              values={type ? [type] : []}
              onChange={vals => {
                if (vals[0]) {
                  push(`${path}?type=${vals[0]}&category=${category || ''}`)
                } else {
                  push(`${path}?type=&category=${category || ''}`)
                }
              }}
            />
            {productCategoryArray.map(item => {
              if (item.childs?.length) {
                const items = [item, ...item.childs]
                return (
                  <Select
                    key={item.id}
                    clearable
                    className={classNames(
                      styles.select,
                      items.find(c => c.id === +category) && styles.active,
                    )}
                    placeholder={item.name}
                    items={items.map(c => ({ value: c.id, label: c.name }))}
                    values={items.find(c => c.id === +category) ? [+category] : []}
                    onChange={vals => {
                      if (vals[0]) {
                        push(`${path}?type=${type || ''}&category=${vals[0]}`)
                      } else {
                        push(`${path}?type=${type || ''}&category=`)
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
                    color={item.id === +category ? BUTTON_COLORS.orange : BUTTON_COLORS.black}
                    onClick={() => {
                      if (item.id === +category) {
                        push(`${path}?type=${type || ''}&category=`)
                      } else {
                        push(`${path}?type=${type || ''}&category=${item.id}`)
                      }
                    }}
                  />
                )
              }
              return null
            })}
          </>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query: { id, type, category, search = '' } }) {
  if (!id || req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const headers = token ? { Authorization: `Token ${token}` } : {}

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyFullUrl = getFullUrl(custodianApiPath + 'company/' + id)
  const companyResponse = await callGetApi(companyFullUrl,{ headers })

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
    depth: 4,
  }
  const productCategoryFullUrl = getFullUrl(custodianApiPath + 'product_category', productCategoryParams)
  const productCategoryResponse = await callGetApi(productCategoryFullUrl, { headers })

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
        },
      },
    },
  }
}

CompanyMarket.SubLayout = CompanyLayout

export default observer(CompanyMarket)
