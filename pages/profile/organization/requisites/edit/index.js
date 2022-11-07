import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import classNames from 'classnames'
import ProfileLayout from '../../../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../../../components/Input'
import { getApiPath } from '../../../../../helpers/fetch'
import Link from '../../../../../components/Link'
import Button, { BUTTON_TYPES } from '../../../../../components/Button'
import { useRouter } from 'next/router'

const RequisitesEdit = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { profile: { company } } = store.authData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => store.deleteFormStore(formStoreName), [])

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const formStoreName = 'company'
  let formStore = store.formStore.has(formStoreName) ? store.formStore.get(formStoreName) : undefined

  if (!formStore) {
    const companyParams = {
      depth: 3,
      exclude: ['address', 'company_types', 'contact_set', 'product_set', 'work_type'],
    }
    const { get, loaded } = store.callHttpQuery(
      custodianApiPath + 'company/' + company, { params: companyParams }
    )

    if (loaded) {
      const requisitesData = get('data.data.legal_info')
      const requisitesAddressData = get('data.data.legal_info.legal_address')
      const requisitesEditData = {
        registrationDate: requisitesData.registration_date,
        inn: requisitesData.inn,
        kpp: requisitesData.kpp,
        okved: requisitesData.okved,
        capital: requisitesData.authorized_capital,
        supervisor: requisitesData.supervisor,
        founder: requisitesData.founder,
        staff: requisitesData.staff,
        revenue: requisitesData.revenue,
        profit: requisitesData.profit,
        address: {
          region: requisitesAddressData.region,
          city: requisitesAddressData.city,
          street: requisitesAddressData.street,
          house: requisitesAddressData.house,
          flat: requisitesAddressData.flat,
        },
      }
      formStore = store.createFormStore(formStoreName, {
        form: {
          data: requisitesEditData,
        },
      })
    }
  }

  if (!formStore) return null

  const { form } = formStore

  return (
    <>
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
          <div className={styles.right}>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="дата регистрации"
                  validate={{ required: true }}
                  value={form.get('data.registrationDate')}
                  errors={form.get('errors.registrationDate')}
                  onChange={(value) => form.set('data.registrationDate', value)}
                  onInvalid={(value) => form.set('errors.registrationDate', value)}
                  onValid={() => form.set('errors.registrationDate', [])}
                />
              </div>
            </div>
            <div className={classNames(styles.row, styles.additionalGap)}>
              <div className={classNames(styles.block, styles.subHeader)}>
                <div className={styles.value}>
                  Юридический адрес
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="регион / район"
                  validate={{ required: true }}
                  value={form.get('data.address.region')}
                  errors={form.get('errors.address.region')}
                  onChange={(value) => form.set('data.address.region', value)}
                  onInvalid={(value) => form.set('errors.address.region', value)}
                  onValid={() => form.set('errors.address.region', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="город / н.п."
                  validate={{ required: true }}
                  value={form.get('data.address.city')}
                  errors={form.get('errors.address.city')}
                  onChange={(value) => form.set('data.address.city', value)}
                  onInvalid={(value) => form.set('errors.address.city', value)}
                  onValid={() => form.set('errors.address.city', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="улица"
                  validate={{ required: true }}
                  value={form.get('data.address.street')}
                  errors={form.get('errors.address.street')}
                  onChange={(value) => form.set('data.address.street', value)}
                  onInvalid={(value) => form.set('errors.address.street', value)}
                  onValid={() => form.set('errors.address.street', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="дом"
                  validate={{ required: true }}
                  value={form.get('data.address.house')}
                  errors={form.get('errors.address.house')}
                  onChange={(value) => form.set('data.address.house', value)}
                  onInvalid={(value) => form.set('errors.address.house', value)}
                  onValid={() => form.set('errors.address.house', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="квартира"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.address.flat')}
                  errors={form.get('errors.address.flat')}
                  onChange={(value) => form.set('data.address.flat', value)}
                  onInvalid={(value) => form.set('errors.address.flat', value)}
                  onValid={() => form.set('errors.address.flat', [])}
                />
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
                <Input
                  label="инн"
                  type={INPUT_TYPES.number}
                  validate={{ required: true, minLen: 10, maxLen: 10 }}
                  value={form.get('data.inn')}
                  errors={form.get('errors.inn')}
                  onChange={(value) => form.set('data.inn', value)}
                  onInvalid={(value) => form.set('errors.inn', value)}
                  onValid={() => form.set('errors.inn', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="оквэд"
                  validate={{ required: true }}
                  value={form.get('data.okved')}
                  errors={form.get('errors.okved')}
                  onChange={(value) => form.set('data.okved', value)}
                  onInvalid={(value) => form.set('errors.okved', value)}
                  onValid={() => form.set('errors.okved', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="кпп"
                  type={INPUT_TYPES.number}
                  validate={{ required: true, minLen: 9, maxLen: 9 }}
                  value={form.get('data.kpp')}
                  errors={form.get('errors.kpp')}
                  onChange={(value) => form.set('data.kpp', value)}
                  onInvalid={(value) => form.set('errors.kpp', value)}
                  onValid={() => form.set('errors.kpp', [])}
                />
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
                <Input
                  label="руководители"
                  validate={{ required: true }}
                  value={form.get('data.supervisor')}
                  errors={form.get('errors.supervisor')}
                  onChange={(value) => form.set('data.supervisor', value)}
                  onInvalid={(value) => form.set('errors.supervisor', value)}
                  onValid={() => form.set('errors.supervisor', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="учредители"
                  validate={{ required: true }}
                  value={form.get('data.founder')}
                  errors={form.get('errors.founder')}
                  onChange={(value) => form.set('data.founder', value)}
                  onInvalid={(value) => form.set('errors.founder', value)}
                  onValid={() => form.set('errors.founder', [])}
                />
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
                <Input
                  label="уставной капитал"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.capital')}
                  errors={form.get('errors.capital')}
                  onChange={(value) => form.set('data.capital', value)}
                  onInvalid={(value) => form.set('errors.capital', value)}
                  onValid={() => form.set('errors.capital', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="среднесписочная численность"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.staff')}
                  errors={form.get('errors.staff')}
                  onChange={(value) => form.set('data.staff', value)}
                  onInvalid={(value) => form.set('errors.staff', value)}
                  onValid={() => form.set('errors.staff', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="выручка за последний год"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.revenue')}
                  errors={form.get('errors.revenue')}
                  onChange={(value) => form.set('data.revenue', value)}
                  onInvalid={(value) => form.set('errors.revenue', value)}
                  onValid={() => form.set('errors.revenue', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="прибыль за последний год"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.profit')}
                  errors={form.get('errors.profit')}
                  onChange={(value) => form.set('data.profit', value)}
                  onInvalid={(value) => form.set('errors.profit', value)}
                  onValid={() => form.set('errors.profit', [])}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          label="Сохранить изменения"
          disabled={form.hasErrors}
          onClick={() => {
            const submit = company ? form.submit(custodianApiPath + 'company/' + company + '/', 'PATCH') :
              form.submit(custodianApiPath + 'company/', 'POST')
            submit.then(({ data }) => {
              store.setAuthData(data?.data)
              store.deleteFormStore(formStoreName)
              router.push('/profile/organization/requisites')
            })
          }}
        />
        <Button
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться в профиль"
          link="/profile/organization/requisites"
        />
      </div>
    </>
  )
}

RequisitesEdit.SubLayout = ProfileLayout

export default observer(RequisitesEdit)
