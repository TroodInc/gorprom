import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import moment from 'moment'

import styles from './index.module.css'
import Image from 'next/image'
import ProfileLayout from '../../../../layout/profile'
import { getApiPath } from '../../../../helpers/fetch'
import { toNumber } from '../../../../helpers/format'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES, BUTTON_TYPES } from '../../../../components/Button'
import Checkbox from '../../../../components/Checkbox'
import Link from '../../../../components/Link'
import organization from '../index'


const Requisites = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { profile: { company } } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const companyParams = {
    depth: 3,
    exclude: ['address', 'company_types', 'contact_set', 'product_set', 'work_type'],
  }
  const companyCall = store.callHttpQuery(custodianApiPath + 'company/' + company, { params: companyParams })
  const logo = companyCall.get('data.data.logo')
  const legalData = companyCall.get('data.data.legal_info') || {}
  const legalAddress = companyCall.get('data.data.legal_info.legal_address') || {}

  return (
    <div className={styles.root}>
      <div className={styles.navigation}>
        <Link
          className={styles.organizationLink}
          href={'/profile/organization'}
        >
          <div className={styles.linkContent}>
            <div>{'<'}</div>
            <div>профиль организации</div>
          </div>
        </Link>
        <Link
          className={styles.financeLink}
          href={'/profile/organization/requisites'}
        >
          <div className={styles.linkContent}>
            <div>финансовая информация</div>
          </div>
        </Link>
        <Link
          className={styles.productsLink}
          href={'/profile/organization/products'}
        >
          <div className={styles.linkContent}>
            <div>товары</div>
            <div>{'>'}</div>
          </div>
        </Link>
      </div>
      <div className={styles.main}>
        <div className={styles.left}>
          <Image
            alt="Logo"
            src={logo || '/image/defaultLogo.jpg'}
            height={140}
            width={140}
            objectFit="contain"
            objectPosition="top"
          />
          <Button
            label="Редактировать"
            type={BUTTON_TYPES.border}
            color={BUTTON_COLORS.orange}
            link="requisites/edit"
          />
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
    </div>
  )
}

Requisites.SubLayout = ProfileLayout

export default observer(Requisites)
