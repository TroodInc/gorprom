import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import moment from 'moment'

import ProfileLayout from '../../../layout/profile'
import { getApiPath } from '../../../helpers/fetch'
import Icon, { ICONS_TYPES } from '../../../components/Icon'
import Button from '../../../components/Button'

import styles from './index.module.css'


const Request = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id, profile: { company } = {} } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const orderProps = {
    q: 'or(' + [
      `eq(creator,${id})`,
      company && `eq(target.product.company,${company}),eq(target.company.id,${company})`,
    ].filter(Boolean).join(',') + '),sort(-created)',
  }
  const getOrder = () => store.callHttpQuery(custodianApiPath + 'order', { params: orderProps })
  const order = getOrder()
  const orderArray = order.get('data.data') || []

  if (!orderArray.length) {
    return (
      <div className={styles.rootEmpty}>
        <div className={styles.title}>
          У вас пока нет запросов
        </div>
        <div className={styles.text}>
          Запрос можно отправить, нажав на кнопку «Отправить запрос» рядом с товаром/услугой
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Запрос</th>
            <th>Последнее изменение</th>
          </tr>
        </thead>
        <tbody>
          {orderArray.map(item => {
            const lastChange = Math.max(moment(item.created), ...item.message_set.map(m => moment(m.created)))
            const lastMessageIndex = item.message_set.length - 1 < 0 ? 0 : item.message_set.length - 1
            const lastMessageMy = item.message_set[lastMessageIndex].sender === id
            return (
              <tr key={item.id} onClick={() => {
                store.createFormStore('request' + item.id, {
                  modalComponent: 'Request',
                  props: {
                    id: item.id,
                    afterClose: getOrder,
                  },
                  form: {
                    data: {
                      order: item.id,
                      text: '',
                    },
                  },
                })
              }}>
                <td data-label="Номер">{item.id}</td>
                <td data-label="Запрос">{item.name || item.target?.name}</td>
                <td data-label="Последнее изменение">
                  <div className={styles.lastChange}>
                    <span>{moment(lastChange).format('DD.MM.YYYY в HH.mm')}</span>
                    {!lastMessageMy && (
                      <Icon type={ICONS_TYPES.mail} size={40} className={styles.mail} />
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

Request.SubLayout = ProfileLayout

Request.layoutProps = {
  profilePage: true,
}

export default observer(Request)
