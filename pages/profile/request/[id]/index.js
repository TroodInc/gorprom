import { MobXProviderContext, observer, Observer } from 'mobx-react'
import { useContext, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'

import ProfileLayout from '../../../../layout/profile'
import { getApiPath } from '../../../../helpers/fetch'
import Button, { BUTTON_TYPES } from '../../../../components/Button'
import Input, { INPUT_TYPES } from '../../../../components/Input'

import styles from './index.module.css'
import Image from 'next/image'


const Request = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { query: { id } } = useRouter()
  const [scrolled, setScrolled] = useState(false)

  if (!id) return null

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const orderProps = {
    depth: 3,
  }
  const order = store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
  if (!order.loaded) return null
  const orderData = order.get('data.data') || {}

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться к заказам"
          link="/profile/request"
        />
        <div className={styles.block}>
          <div className={styles.title}>Запрос</div>
          <div className={styles.value}>{orderData.target?.name}</div>
        </div>
        <div className={styles.block}>
          <div className={styles.title}>Номер</div>
          <div className={styles.value}>{orderData.id}</div>
        </div>
      </div>
      <div className={styles.right}>
        <div
          ref={node => {
            if (node && !scrolled) {
              setScrolled(true)
              setTimeout(() => {
                node.scrollTo(0, node.scrollHeight)
              }, 50)
            }
          }}
          className={styles.messages}
        >
          {orderData.message_set.map(item => {
            const { sender = {} } = item
            return (
              <div key={item.id} className={styles.message}>
                <div className={styles.avatar}>
                  <Image
                    alt="Avatar"
                    src={sender.avatar || '/image/defaultAvatar.jpg'}
                    height={72}
                    width={72}
                    style={{
                      borderRadius: '50%',
                    }}
                    objectFit="cover"
                  />
                </div>
                <div className={styles.main}>
                  <div className={styles.user}>
                    {`${sender.name || ''} ${sender.surname || ''}`.trim() || `User${sender.id + 1004367}`}
                  </div>
                  <div className={styles.text}>
                    {item.text}
                  </div>
                </div>
                <div className={styles.date}>
                  {moment(item.created).format('HH:mm, DD:MM:YY')}
                </div>
              </div>
            )
          })}
        </div>
        <Observer>
          {() => {
            const formStoreName = `request${id}`
            const formStore = store.createFormStore(formStoreName, {
              form: {
                data: {
                  order: +id,
                },
              },
            })
            const { form } = formStore

            return (
              <div className={styles.newMessage}>
                <Input
                  type={INPUT_TYPES.multi}
                  minRows={2}
                  className={styles.input}
                  placeholder='Напишите сообщение...'
                  value={form.get('data.text')}
                  errors={form.get('errors.text')}
                  onChange={(value) => form.set('data.text', value)}
                  onInvalid={(value) => form.set('errors.text', value)}
                  onValid={() => form.set('errors.text', [])}
                  onEnter={() => form.submit(custodianApiPath + 'message', 'POST')
                    .then(() => {
                      form.set('data.text', '')
                      setScrolled(false)
                      store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
                    })}
                />
                <Button
                  className={styles.sendMessage}
                  type={BUTTON_TYPES.text}
                  label="Отправить"
                  onClick={() => form.submit(custodianApiPath + 'message', 'POST')
                    .then(() => {
                      form.set('data.text', '')
                      setScrolled(false)
                      store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
                    })}
                />
              </div>
            )
          }}
        </Observer>
      </div>
    </div>
  )
}

Request.SubLayout = ProfileLayout

Request.layoutProps = {
  profilePage: true,
}

export default observer(Request)
