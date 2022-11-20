import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import ProfileLayout from '../../../../layout/profile'
import { getApiPath } from '../../../../helpers/fetch'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES, BUTTON_TYPES } from '../../../../components/Button'
import MarketCard from '../../../../components/MarketCard'
import Select from '../../../../components/Select'

import styles from './index.module.css'


const TYPES = [
  { value: 'PRODUCT', label: 'Товары' },
  { value: 'SERVICE', label: 'Услуги' },
]

const path = '/profile/organization/products'

const CompanyProducts = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { profile: { company } } = store.authData
  const { query: { type, category }, push } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    q: [
      `eq(company,${company})`,
      type && type !== 'ALL' && `eq(type,${type})`,
      category && `or(eq(category,${category}),eq(category.parent,${category}))`,
    ].filter(Boolean).join(','),
  }
  const product = store.callHttpQuery(custodianApiPath + 'product', { params: productParams })
  const productArray = product.get('data.data') || []

  const productCategoryParams = {
    depth: 4,
  }
  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', { params: productCategoryParams })
  const productCategoryArray = productCategory.get('data.data') || []

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button
          label="Новый товар/услуга"
          color={BUTTON_COLORS.orange}
          specialType={BUTTON_SPECIAL_TYPES.plus}
          link="/profile/organization/products/edit"
        />
        {productArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="PRODUCT"
            showType
            host={host}
            onEdit={() => push(`/profile/organization/products/edit/${item.id}`)}
          />
        ))}
      </div>
      <div className={styles.right}>
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
      </div>
    </div>
  )
}

CompanyProducts.SubLayout = ProfileLayout

export default observer(CompanyProducts)
