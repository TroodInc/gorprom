import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'

import ProfileLayout from '../../../layout/profile'
import { getApiPath } from '../../../helpers/fetch'
import Icon, { ICONS_TYPES } from '../../../components/Icon'

import styles from './index.module.css'


const Request = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { push, pathname } = useRouter()
  const { id, profile: { company } = {} } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const orderProps = {
    q: 'or(' + [
      `eq(creator,${id})`,
      company && `eq(target.product.company,${company}),eq(target.company.id,${company})`,
    ].filter(Boolean).join(',') + ')',
  }
  const order = store.callHttpQuery(custodianApiPath + 'order', { params: orderProps })
  const orderArray = order.get('data.data') || []

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
              <tr key={item.id} onClick={() => push(`${pathname}/${item.id}`)}>
                <td>{item.id}</td>
                <td>{item.target.name}</td>
                <td>
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
