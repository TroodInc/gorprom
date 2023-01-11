import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'

import ProfileLayout from '../../../layout/profile'
import { getApiPath, callDeleteApi } from '../../../helpers/fetch'
import Button from '../../../components/Button'
import MarketCard from '../../../components/MarketCard'

import styles from './index.module.css'


const Request = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id, token } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const favoriteParams = {
    q: `eq(employee,${id})`,
    exclude: 'employee',
    depth: 3,
  }
  const favoriteEndpoint = custodianApiPath + 'favorite'
  const favorite = store.callHttpQuery(favoriteEndpoint, { params: favoriteParams })
  const favoriteArray = favorite.get('data.data') || []

  if (!favoriteArray.length) {
    return (
      <div className={styles.rootEmpty}>
        <div className={styles.title}>
          В избранном пусто
        </div>
        <div className={styles.text}>
          Добавляйте товары/услуги с помощью иконки «Звездочка»
        </div>
        <Button
          className={styles.button}
          label="Перейти к поиску товаров и услуг"
          link="/market"
        />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {favoriteArray.map(item => (
        <MarketCard
          key={item.id}
          data={item.product}
          type={item.product.type.id}
          host={host}
          onFavRemove={() => {
            callDeleteApi(
              favoriteEndpoint + '/' + item.id,
              token ? { headers: { Authorization: `Token ${token}` } } : undefined,
            )
              .then(() => store.callHttpQuery(favoriteEndpoint, {
                params: favoriteParams,
                cacheTime: 0,
              }))
          }}
        />
      ))}
    </div>
  )
}

Request.SubLayout = ProfileLayout

Request.layoutProps = {
  profilePage: true,
}

export default observer(Request)
