import { MobXProviderContext, observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import classNames from 'classnames'
import moment from 'moment'

import styles from './index.module.css'
import Image from 'next/image'
import ProfileLayout from '../../../../layout/profile'
import { getApiPath } from '../../../../helpers/fetch'
import { toNumber } from '../../../../helpers/format'
import Icon, { ICONS_TYPES } from '../../../../components/Icon'
import Link from '../../../../components/Link'
import { ruleChecker } from '../../../../helpers/abac'
import AbacContext from '../../../../abacContext'


const Requisites = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { profile: { company } } = store.authData
  const { push } = useRouter()
  const { abacContext, abacRules } = useContext(AbacContext)

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    depth: 3,
    exclude: ['address', 'company_types', 'contact_set', 'product_set', 'work_type'],
  }
  const companyCall = store.callHttpQuery(custodianApiPath + 'company/' + company, { params: companyParams })
  const companyData = companyCall.get('data.data') || {}
  const logo = companyCall.get('data.data.logo')
  const legalData = companyCall.get('data.data.legal_info') || {}
  const legalAddress = companyCall.get('data.data.legal_info.legal_address') || {}
  const verify = companyCall.get('data.data.verify')

  const { access } = ruleChecker({
    rules: abacRules,
    domain: 'CUSTODIAN',
    resource: 'company',
    action: 'data_PATCH',
    values: {
      ...abacContext,
      obj: companyData,
    },
  })

  return (
    <>
      <div className={styles.header}>
        <h2>Финансовая информация</h2>
        {access && (
          <Icon
            className={styles.pencil}
            size={32}
            type={ICONS_TYPES.pencil}
            onClick={() => push('/profile/organization/requisites/edit')}
          />
        )}
      </div>
      <div className={styles.root}>
        <div className={styles.left}>
          <Image
            alt="Logo"
            src={logo || '/image/defaultLogo.jpg'}
            height={90}
            width={140}
            objectFit="contain"
            objectPosition="top"
          />
          <Icon
            className={classNames(styles.verifyIcon, verify && styles.active)}
            type={ICONS_TYPES.confirm}
            size={10}
          />
          <div className={classNames(styles.verifyText, verify && styles.active)}>
            {verify ? 'Верифицировано' : 'Неверифицировано'} Ассоциацией НП &laquo;Горнопромышленники России&raquo;
          </div>
          <div>
              Подробнее про верификацию по ссылке<br/>
            <Link
              className={styles.link}
              href={'/agreement'}
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Дата регистрации
              </div>
              <div className={styles.value}>
                {legalData.registration_date && moment(legalData.registration_date).format('DD.MM.YYYY')}
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
            <div className={styles.block}>
              <div className={styles.title}>
                КПП
              </div>
              <div className={styles.value}>
                {legalData.kpp}
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
    </>
  )
}

Requisites.SubLayout = ProfileLayout

export default observer(Requisites)
