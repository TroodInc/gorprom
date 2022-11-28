import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import ProfileLayout from '../../../../layout/profile'
import { getApiPath } from '../../../../helpers/fetch'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES } from '../../../../components/Button'
import MarketCard from '../../../../components/MarketCard'
import CategoryFilter from '../../../../components/CategoryFilter'

import styles from './index.module.css'


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
    depth: 1,
  }
  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', { params: productCategoryParams })
  const productCategoryArray = productCategory.get('data.data') || []

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button
          className={styles.addButton}
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
    </div>
  )
}

CompanyProducts.SubLayout = ProfileLayout

export default observer(CompanyProducts)
