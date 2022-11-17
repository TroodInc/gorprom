import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'

import Link from '../Link'
import Button from '../Button'

import styles from './index.module.css'
import { getApiPath } from '../../helpers/fetch'


const TypeNameDict = {
  'PRODUCT': 'Товар',
  'SERVICE': 'Услуга',
  'COMPANY': 'Компания',
}

const TypeImgDict = {
  'PRODUCT': '/image/product.png',
  'SERVICE': '/image/service.png',
  'COMPANY': '/image/company.png',
}

const TypeObjectTypeDict = {
  'PRODUCT': 'product',
  'SERVICE': 'product',
  'COMPANY': 'company',
}

const getTypeLink = (type, item) => {
  switch (type) {
    case 'PRODUCT':
      return `/market/product/${item.id}`
    case 'SERVICE':
      return `/market/service/${item.id}`
    case 'COMPANY':
      return `/market/company/${item.id}`
    default:
      return undefined
  }
}

const needLoginFormName = 'unauthorized'

const needLogin = ({ store, reason }) => (
  <div className={styles.messageBox}>
    <span>Чтобы {reason}, Вам неоходимо</span>
    <Link
      className={styles.link}
      href="/registration"
      onClick={() => store.deleteFormStore(needLoginFormName)}
    >
      зарегистрироваться
    </Link>
    <span>или</span>
    <Link
      className={styles.link}
      href="/login"
      onClick={() => store.deleteFormStore(needLoginFormName)}
    >
      авторизироваться
    </Link>
  </div>
)

const MarketCard = ({ className, data = {}, type = 'PRODUCT', showType, host, onEdit }) => {
  const { store } = useContext(MobXProviderContext)
  const { id } = store.authData
  const router = useRouter()
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  let image = type === 'COMPANY' ? data.logo : (data.photo_set || [])[0]?.link
  if (!image) image = TypeImgDict[type]

  return (
    <div className={classNames(styles.root, className, styles[type.toLowerCase()])}>
      <div className={styles.left}>
        <Image
          alt={data.name}
          src={image}
          width={190}
          height={110}
          objectFit="cover"
        />
      </div>
      <div className={styles.center}>
        <h2 className={styles.title}>
          {!onEdit && !!id && (
            <Link className={styles.link} href={getTypeLink(type, data)}>
              {data.name}
            </Link>
          )}
          {!onEdit && !id && (
            <div
              className={styles.link}
              onClick={() => {
                store.createFormStore(needLoginFormName, {
                  modalComponent: 'MessageBox',
                  props: {
                    width: 600,
                    children: needLogin({ store, reason: 'увидеть все данные' }),
                  },
                })
              }}
            >
              {data.name}
            </div>
          )}
          {onEdit && data.name}
        </h2>
        {type === 'COMPANY' && (
          <div className={styles.description}>
            {data.description}
          </div>
        )}
        <div className={styles.footer}>
          {type !== 'COMPANY' && (
            <div className={styles.companyName}>
              {!onEdit && (
                <Link className={styles.link} href={getTypeLink('COMPANY', data)}>
                  {data.company?.name}
                </Link>
              )}
              {onEdit && data.company?.name}
            </div>
          )}
          {type === 'COMPANY' && (
            <div />
          )}
          {showType && (
            <div className={styles.type}>
              Категория: {TypeNameDict[type].toLowerCase()}
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div />
        {onEdit && (
          <Button
            className={styles.button}
            label="Изменить"
            onClick={onEdit}
          />
        )}
        {!onEdit && (
          <Button
            className={styles.button}
            label="Отправить запрос"
            onClick={() => {
              if (id) {
                const formStoreName = 'request' + type + data.id
                const formStore = store.createFormStore(formStoreName, {
                  form: {
                    data: {
                      target: {
                        _object: TypeObjectTypeDict[type],
                        id: data.id,
                      },
                      message_set: [
                        {
                          text: 'Отправлен запрос',
                        }],
                    },
                  },
                })
                formStore.form.submit(custodianApiPath + 'order', 'POST').then(() => router.push('/profile/request'))
              } else {
                store.createFormStore(needLoginFormName, {
                  modalComponent: 'MessageBox',
                  props: {
                    width: 600,
                    children: needLogin({ store, reason: 'отправить запрос' }),
                  },
                })
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default observer(MarketCard)
