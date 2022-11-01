import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import moment from 'moment'

import CompanyLayout from '../../../../../layout/company'

import { callGetApi, getApiPath, getFullUrl } from '../../../../../helpers/fetch'
import { toNumber } from '../../../../../helpers/format'

import styles from './index.module.css'
import Image from 'next/image'


const CompanyProfile = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { query: { id } } = router

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    depth: 3,
    exclude: ['address', 'company_types', 'contact_set', 'product_set', 'work_type'],
  }
  const company = store.callHttpQuery(custodianApiPath + 'company/' + id, { params: companyParams })
  const logo = company.get('data.data.logo')
  const legalData = company.get('data.data.legal_info') || {}
  const legalAddress = company.get('data.data.legal_info.legal_address') || {}

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Image
          alt="Logo"
          src={logo || '/image/defaultLogo.jpg'}
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
              Дата регистрации
            </div>
            <div className={styles.value}>
              {legalData.registration_date && moment(legalData.registration_date).format('DD / MM / YY')}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Юридический адрес
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Регион / район
            </div>
            <div className={styles.value}>
              {legalAddress.region}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Город / н.п.
            </div>
            <div className={styles.value}>
              {legalAddress.city}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Улица
            </div>
            <div className={styles.value}>
              {legalAddress.street}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Дом
            </div>
            <div className={styles.value}>
              {legalAddress.house}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Квартира / офис
            </div>
            <div className={styles.value}>
              {legalAddress.flat}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Реквизиты
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              ИНН
            </div>
            <div className={styles.value}>
              {legalData.inn}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              КПП
            </div>
            <div className={styles.value}>
              {legalData.kpp}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              ОКВЄД
            </div>
            <div className={styles.value}>
              {legalData.okved}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Команда
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Руководители
            </div>
            <div className={styles.value}>
              {legalData.supervisor}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Учредители
            </div>
            <div className={styles.value}>
              {legalData.founder}
            </div>
          </div>
        </div>
        <div className={classNames(styles.row, styles.additionalGap)}>
          <div className={styles.block}>
            <div className={styles.value}>
              Финансы
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              уставной капитал
            </div>
            <div className={styles.value}>
              {legalData.authorized_capital && toNumber(legalData.authorized_capital)}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Среднесписочная численность
            </div>
            <div className={styles.value}>
              {legalData.staff}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.block}>
            <div className={styles.title}>
              Выручка за последний год
            </div>
            <div className={styles.value}>
              {legalData.revenue && toNumber(legalData.revenue)}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Прибыль за последний год
            </div>
            <div className={styles.value}>
              {legalData.profit && toNumber(legalData.profit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, query: { id, type, category, search = '' } }) {
  if (!id || req.url.startsWith('/_next')) return { props: {} } // dont preload data on client-side

  const { headers: { host }, cookies: { token } = {} } = req

  const headers = token ? { Authorization: `Token ${token}` } : {}

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    depth: 3,
    exclude: ['address', 'company_types', 'contact_set', 'product_set', 'work_type'],
  }
  const companyFullUrl = getFullUrl(custodianApiPath + 'company/' + id, companyParams)
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
