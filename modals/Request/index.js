import { MobXProviderContext, Observer } from 'mobx-react'
import { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import Image from 'next/image'

import { getApiPath } from '../../helpers/fetch'
import { formatSize } from '../../helpers/format'

import Modal from '../../components/Modal'
import Icon, { ICONS_TYPES } from '../../components/Icon'
import Input, { INPUT_TYPES } from '../../components/Input'
import Link from '../../components/Link'

import styles from './index.module.css'
import moment from 'moment'


const Request = ({ onClose, host, id, ...other }) => {
  const { store } = useContext(MobXProviderContext)
  const [scrolled, setScrolled] = useState(0)

  if (!id) return null

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const orderProps = {
    depth: 3,
  }
  const order = store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
  const orderData = order.get('data.data') || {}

  return (
    <Modal
      type="right"
      className={styles.root}
      overlayClassName={styles.overlay}
      style={{
        width: 'calc(50% - 24px)',
        height: 'calc(75% - 48px)',
        position: 'absolute',
        bottom: 24,
        right: 24,
        alignItems: 'stretch',
        justifyContent: 'stretch',
        padding: 24,
      }}
      {...other}
      onClose={undefined}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {orderData.name || orderData.target?.name}
        </div>
        <Icon
          size={16}
          type={ICONS_TYPES.close}
          onClick={onClose}
        />
      </div>
      <div
        ref={node => {
          if (node && scrolled !== (orderData.message_set || []).length) {
            setScrolled((orderData.message_set || []).length)
            setTimeout(() => {
              node.scrollTo(0, node.scrollHeight)
            }, 50)
          }
        }}
        className={styles.messages}
      >
        {(orderData.message_set || []).map(item => {
          const { sender = {}, attachments_set: attachmentsSet = [] } = item
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
                {!!attachmentsSet.length && (
                  <div className={styles.attachments}>
                    {sortBy(attachmentsSet, 'type').map(item => {
                      if (item.type === 'IMAGE') {
                        return (
                          <Link key={item.id} href={item.file_url} download>
                            <Image
                              alt={item.filename}
                              src={item.file_url}
                              width={172}
                              height={172}
                              objectFit="cover"
                            />
                          </Link>
                        )
                      }
                      return (
                        <Link key={item.id} className={styles.attachment} href={item.file_url} download>
                          <Icon
                            className={styles.iconFile}
                            size={32}
                            type={ICONS_TYPES.doc}
                          />
                          <div className={styles.attachmentInfo}>
                            <div className={styles.attachmentName}>
                              {item.filename}
                            </div>
                            <div className={styles.attachmentSize}>
                              {formatSize(item.size)}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
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
          const formStoreName = `request${id}_${(orderData.message_set || []).length}`
          const formStore = store.createFormStore(formStoreName, {
            form: {
              data: {
                order: id,
              },
            },
          })
          const { form } = formStore

          return (
            <div className={styles.newMessage}>
              <Input
                type={INPUT_TYPES.multi}
                minRows={2}
                maxRows={4}
                className={styles.input}
                placeholder='Напишите сообщение...'
                value={form.get('data.text')}
                errors={form.get('errors.text')}
                onChange={(value) => form.set('data.text', value)}
                onInvalid={(value) => form.set('errors.text', value)}
                onValid={() => form.set('errors.text', [])}
                onEnter={() => {
                  if (form.get('data.text')) {
                    form.submit(custodianApiPath + 'message', 'POST').then(() => {
                      form.set('data.text', '')
                      setScrolled(false)
                      store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
                    })
                  }
                }}
              />
              {/*
              <Button
                className={styles.sendMessage}
                type={BUTTON_TYPES.text}
                label="Отправить"
                onClick={() => {
                  if (form.get('data.text')) {
                    form.submit(custodianApiPath + 'message', 'POST').then(() => {
                      form.set('data.text', '')
                      setScrolled(false)
                      store.callHttpQuery(custodianApiPath + 'order/' + id, { params: orderProps })
                    })
                  }
                }}
              />
              */}
            </div>
          )
        }}
      </Observer>
    </Modal>
  )
}

export default Request
