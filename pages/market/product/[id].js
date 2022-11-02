import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, Fragment } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { callGetApi, getApiPath, getFullUrl } from '../../../helpers/fetch'
import Button from '../../../components/Button'
import Link from '../../../components/Link'
import SubMenu from '../../../components/SubMenu'

import styles from './item.module.css'
import Icon, { ICONS_TYPES } from '../../../components/Icon'


const Product = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { pathname, query: { id, view = 'description' } } = router
  const path = pathname.replace('[id]', id)

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    depth: 3,
  }
  const product = store.callHttpQuery(custodianApiPath + 'product/' + id, { params: productParams })
  const productData = product.get('data.data')

  if (!productData) return null

  const openGallery = (startIndex) => () => {
    store.createFormStore('gallery', {
      modalComponent: 'Gallery',
      props: {
        items: productData.photo_set.map(item => item.link),
        startIndex,
      },
    })
  }

  const { category } = productData

  const breadcrumbs = [
    { title: 'Маркетплейс', link: '/market' },
    { title: 'Товары', link: '/market/product' },
  ]
  if (category?.parent) {
    breadcrumbs.push({ title: category.parent.name, link: `/market/product?category=${category.parent.id}` })
  }
  breadcrumbs.push({ title: category.name, link: `/market/product?category=${category.id}` })

  return (
    <div className={styles.root}>
      <div className={styles.breadcrumbs}>
        {breadcrumbs.map((item, i) => (
          <Fragment key={item.link}>
            {!!i && ' > '}
            <Link className={styles.link} href={item.link}>{item.title}</Link>
          </Fragment>
        ))}
      </div>
      <h1 className={styles.title}>{productData.name}</h1>
      <div className={styles.header}>
        <h2>
          <Link className={styles.company} href={`/market/company/${productData.company.id}`}>
            {productData.company.name}
          </Link>
        </h2>
      </div>
      <div className={styles.main}>
        {productData.photo_set && !!productData.photo_set.length && (
          <div className={styles.left}>
            <div className={styles.image} onClick={openGallery(0)}>
              <Image
                alt="Photo 1"
                src={productData.photo_set[0].link}
                width={390}
                height={280}
                objectFit="cover"
              />
              <Icon size={70} type={ICONS_TYPES.zoom} className={styles.zoom} />
            </div>
            <div className={styles.gallery}>
              {productData.photo_set.map((item, i) => {
                if (!i) return null
                return (
                  <div key={item.id} className={styles.image} onClick={openGallery(i)}>
                    <Image
                      alt={`Photo ${i + 1}`}
                      src={item.link}
                      width={120}
                      height={120}
                      objectFit="cover"
                    />
                    <Icon size={40} type={ICONS_TYPES.zoom} className={classNames(styles.zoom, styles.smallZoom)} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className={styles.center}>
          <div className={styles.teaser}>
            {productData.teaser}
          </div>
        </div>
        <div className={styles.right}>
          <Button
            label="Отправить запрос"
            onClick={() => {
              const requestFormStoreName = 'requestPRODUCT' + id
              const requestFormStore = store.createFormStore(requestFormStoreName, {
                form: {
                  data: {
                    target: {
                      _object: 'product',
                      id,
                    },
                    message_set: [
                      {
                        text: 'Отправлен запрос',
                      }],
                  },
                },
              })
              requestFormStore.form.submit(custodianApiPath + 'order', 'POST')
                .then(() => router.push('/profile/request'))
            }}
          />
        </div>
      </div>
      <SubMenu
        items={[
          { link: `${path}`, title: 'Описание', scroll: false, activeWithQuery: ['view'] },
          { link: `${path}?view=property`, title: 'Характеристики', scroll: false, activeWithQuery: ['view'] },
        ]}
      />
      {view === 'description' && (
        <div className={styles.description}>
          {(productData.description || '').split('\n')
            .map((text, i) => (
              <p key={i}>{text}</p>
            ))
          }
        </div>
      )}
      {view === 'property' && (
        <div className={styles.properties}>
          {(productData.attribute_set || []).map(item => (
            <div key={item.id} className={styles.property}>
              <div className={styles.propertyName}>{item.name}</div>
              <div className={styles.propertyValue}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps({ req, query }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const productParams = {
    depth: 3,
  }
  const productFullUrl = getFullUrl(custodianApiPath + 'product/' + query.id, productParams)
  const productResponse = await callGetApi(
    productFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  return {
    props: {
      initialStore: {
        httpQuery: {
          [productFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: productResponse,
          },
        },
      },
    },
  }
}

export default observer(Product)
