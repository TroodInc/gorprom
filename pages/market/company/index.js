import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import { callGetApi, getApiPath, getFullUrl } from '../../../helpers/fetch'
import MarketLayout from '../../../layout/market'
import Select from '../../../components/Select'
import CategoryFilter from '../../../components/CategoryFilter'
import MarketCard from '../../../components/MarketCard'

import styles from './index.module.css'

const Market = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { query, pathname, push } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    q: [
      query?.work_type && `eq(work_type,${query?.work_type})`,
      query?.company_type && `eq(company_types,${query?.company_type})`,
    ].filter(Boolean).join(','),
    exclude: ['company_types', 'work_type', 'product_set'],
  }
  const company = store.callHttpQuery(custodianApiPath + 'company', { params: companyParams })
  const companyArray = company.get('data.data') || []

  const workType = store.callHttpQuery(custodianApiPath + 'work_type')
  const workTypeArray = workType.get('data.data') || []
  const workTypeByCategory = workTypeArray.reduce((memo, item, i) => {
    const category = item.category.id
    const categoryItems = memo[category]?.childs || []

    const newItem = {
      id: item.id,
      name: item.name,
    }

    return {
      ...memo,
      [category]: {
        name: item.category.name,
        childs: [
          ...categoryItems,
          newItem,
        ],
      },
    }
  }, {})

  // TODO workTypeCategory on backend

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {companyArray.map(item => (
          <MarketCard
            key={item.id}
            data={item}
            type="COMPANY"
            host={host}
          />
        ))}
      </div>
      <div className={styles.right}>
        <div className={styles.title}>Типы деятельности</div>
        <CategoryFilter
          items={Object.values(workTypeByCategory)}
          value={query?.work_type && +query?.work_type}
          onChange={val => {
            if (val) {
              push(`${pathname}?work_type=${val}`)
            } else {
              push(pathname)
            }
          }}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query }) {
  if (req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    q: [
      query?.work_type && `eq(work_type,${query?.work_type})`,
      query?.company_type && `eq(company_types,${query?.company_type})`,
    ].filter(Boolean).join(','),
    exclude: ['company_types', 'work_type', 'product_set'],
  }
  const companyFullUrl = getFullUrl(custodianApiPath + 'company', companyParams)
  const companyResponse = await callGetApi(
    companyFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const workTypeFullUrl = getFullUrl(custodianApiPath + 'work_type')
  const workTypeResponse = await callGetApi(
    workTypeFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  const companyTypeFullUrl = getFullUrl(custodianApiPath + 'company_type')
  const companyTypeResponse = await callGetApi(
    companyTypeFullUrl,
    token ? { headers: { Authorization: `Token ${token}` } } : undefined,
  )

  return {
    props: {
      initialStore: {
        httpQuery: {
          [companyFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: companyResponse,
          },
          [workTypeFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: workTypeResponse,
          },
          [companyTypeFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: companyTypeResponse,
          },
        },
      },
    },
  }
}

Market.SubLayout = MarketLayout

export default observer(Market)
