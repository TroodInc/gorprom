import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'

import { humanizeNumber } from '../../../helpers/format'

import { callGetApi, getApiPath, getFullUrl } from '../../../helpers/fetch'
import MarketLayout from '../../../layout/market'
import MarketCard from '../../../components/MarketCard'

import styles from './index.module.css'


const Market = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { query: { search = '', type } } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  let productArray = []
  let productCount = 0
  let serviceArray = []
  let serviceCount = 0
  let companyArray = []
  let companyCount = 0

  if (type === 'PRODUCT' || type === 'ALL') {
    const productParams = {
      q: `eq(type,PRODUCT),like(name,*${search}*)`,
    }
    const product = store.callHttpQuery(custodianApiPath + 'product', { params: productParams })
    productArray = product.get('data.data') || []
    productCount = product.get('data.total_count') || 0
  }

  if (type === 'SERVICE' || type === 'ALL') {
    const serviceParams = {
      q: `eq(type,SERVICE),like(name,*${search}*)`,
    }
    const service = store.callHttpQuery(custodianApiPath + 'product', { params: serviceParams })
    serviceArray = service.get('data.data') || []
    serviceCount = service.get('data.total_count') || 0
  }

  if (type === 'COMPANY' || type === 'ALL') {
    const companyParams = {
      q: `like(name,*${search}*)`,
      exclude: ['company_types', 'work_type', 'product_set'],
    }
    const company = store.callHttpQuery(custodianApiPath + 'company', { params: companyParams })
    companyArray = company.get('data.data') || []
    companyCount = company.get('data.total_count') || 0
  }

  const totalCount = productCount + serviceCount + companyCount

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.header}>
          {!totalCount && (
            <div>Не найдено совпадений</div>
          )}
          {!!totalCount && (
            <div>
              Найдено: {humanizeNumber(totalCount, 'совпадение', 'совпадения', 'совпадений')}
            </div>
          )}
        </div>
        {productArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="PRODUCT"
            showType
            host={host}
          />
        ))}
        {serviceArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="SERVICE"
            showType
            host={host}
          />
        ))}
        {companyArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="COMPANY"
            showType
            host={host}
          />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const headers = token ? { Authorization: `Token ${token}` } : {}

  const { type, search = '' } = query

  if (!search.trim()) return { props: {} }

  const httpQuery = {}

  if (type === 'COMPANY' || type === 'ALL') {
    const companyParams = {
      q: `like(name,*${search}*)`,
      exclude: ['company_types', 'work_type', 'product_set'],
    }
    const companyFullUrl = getFullUrl(custodianApiPath + 'company', companyParams)

    const companyResponse = await callGetApi(companyFullUrl, { headers })

    httpQuery[companyFullUrl] = {
      callTime: Date.now(),
      loaded: true,
      response: companyResponse,
    }
  }

  if (type === 'PRODUCT' || type === 'ALL') {
    const productParams = {
      q: `eq(type,PRODUCT),like(name,*${search}*)`,
    }
    const productFullUrl = getFullUrl(custodianApiPath + 'product', productParams)

    const productResponse = await callGetApi(productFullUrl, { headers })

    httpQuery[productFullUrl] = {
      callTime: Date.now(),
      loaded: true,
      response: productResponse,
    }
  }

  if (type === 'SERVICE' || type === 'ALL') {
    const serviceParams = {
      q: `eq(type,SERVICE),like(name,*${search}*)`,
    }
    const serviceFullUrl = getFullUrl(custodianApiPath + 'product', serviceParams)

    const serviceResponse = await callGetApi(serviceFullUrl, { headers })

    httpQuery[serviceFullUrl] = {
      callTime: Date.now(),
      loaded: true,
      response: serviceResponse,
    }
  }

  if (Object.keys(httpQuery)) {
    return {
      props: {
        initialStore: {
          httpQuery,
        },
      },
    }
  }

  return { props: {} }
}

Market.SubLayout = MarketLayout

export default observer(Market)
