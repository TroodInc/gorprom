import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import CompanyLayout from '../../../../../layout/company'

import { callGetApi, getApiPath, getFullUrl } from '../../../../../helpers/fetch'
import { toPhone } from '../../../../../helpers/format'

import styles from './index.module.css'
import Image from 'next/image'


const CompanyProfile = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { query: { id } } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const company = store.callHttpQuery(custodianApiPath + 'company/' + id)
  const companyData = company.get('data.data') || {}
  const companyAddress = company.get('data.data.address') || {}

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Image
          alt="Logo"
          src={companyData.logo || '/image/defaultLogo.jpg'}
          height={300}
          width={170}
          objectFit="contain"
          objectPosition="top"
        />
      </div>
      <div className={styles.main}>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Название
            </div>
            <div className={styles.value}>
              {companyData.name}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Форма собственности
            </div>
            <div className={styles.value}>
              {companyData.ownership_type?.name}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Структура организации
            </div>
            <div className={styles.value}>
              {companyData.department_type?.name}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Тип организации
            </div>
            <div className={styles.value}>
              {companyData.company_types.map(t => t.name).join(', ')}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Тип деятельности
            </div>
            <div className={styles.value}>
              {companyData.work_type.map(t => t.name).join(', ')}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Адрес
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Регион / район
            </div>
            <div className={styles.value}>
              {companyAddress.region}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Город / н.п.
            </div>
            <div className={styles.value}>
              {companyAddress.city}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Улица
            </div>
            <div className={styles.value}>
              {companyAddress.street}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Дом
            </div>
            <div className={styles.value}>
              {companyAddress.house}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Квартира / офис
            </div>
            <div className={styles.value}>
              {companyAddress.flat}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Контакты
            </div>
          </div>
        </div>
        {companyData.contact_set.map(item => (
          <div key={item.id} className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                {item.comment}
              </div>
              <div className={styles.value}>
                +{toPhone(item.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query: { id, type, category, search = '' } }) {
  if (!id || req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const headers = token ? { Authorization: `Token ${token}` } : {}

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyFullUrl = getFullUrl(custodianApiPath + 'company/' + id)
  const companyResponse = await callGetApi(companyFullUrl, { headers })

  return {
    props: {
      initialStore: {
        httpQuery: {
          [companyFullUrl]: {
            callTime: Date.now(),
            loaded: true,
            response: companyResponse,
          },
        },
      },
    },
  }
}

CompanyProfile.SubLayout = CompanyLayout

export default observer(CompanyProfile)
