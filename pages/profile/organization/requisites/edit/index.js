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

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const formStoreName = 'company' + company
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
      formStore = store.createFormStore(formStoreName, {
        form: {
          data: {
            legal_info: get('data.data.legal_info'),
          },
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
                  value={form.get('data.legal_info.registration_date')}
                  errors={form.get('errors.legal_info.registration_date')}
                  onChange={(value) => form.set('data.legal_info.registration_date', value)}
                  onInvalid={(value) => form.set('errors.legal_info.registration_date', value)}
                  onValid={() => form.set('errors.legal_info.registration_date', [])}
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
                  value={form.get('data.legal_info.legal_address.region')}
                  errors={form.get('errors.legal_info.legal_address.region')}
                  onChange={(value) => form.set('data.legal_info.legal_address.region', value)}
                  onInvalid={(value) => form.set('errors.legal_info.legal_address.region', value)}
                  onValid={() => form.set('errors.legal_info.legal_address.region', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="город / н.п."
                  validate={{ required: true }}
                  value={form.get('data.legal_info.legal_address.city')}
                  errors={form.get('errors.legal_info.legal_address.city')}
                  onChange={(value) => form.set('data.legal_info.legal_address.city', value)}
                  onInvalid={(value) => form.set('errors.legal_info.legal_address.city', value)}
                  onValid={() => form.set('errors.legal_info.legal_address.city', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="улица"
                  validate={{ required: true }}
                  value={form.get('data.legal_info.legal_address.street')}
                  errors={form.get('errors.legal_info.legal_address.street')}
                  onChange={(value) => form.set('data.legal_info.legal_address.street', value)}
                  onInvalid={(value) => form.set('errors.legal_info.legal_address.street', value)}
                  onValid={() => form.set('errors.legal_info.legal_address.street', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="дом"
                  validate={{ required: true }}
                  value={form.get('data.legal_info.legal_address.house')}
                  errors={form.get('errors.legal_info.legal_address.house')}
                  onChange={(value) => form.set('data.legal_info.legal_address.house', value)}
                  onInvalid={(value) => form.set('errors.legal_info.legal_address.house', value)}
                  onValid={() => form.set('errors.legal_info.legal_address.house', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="квартира"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.legal_info.legal_address.flat')}
                  errors={form.get('errors.legal_info.legal_address.flat')}
                  onChange={(value) => form.set('data.legal_info.legal_address.flat', value)}
                  onInvalid={(value) => form.set('errors.legal_info.legal_address.flat', value)}
                  onValid={() => form.set('errors.legal_info.legal_address.flat', [])}
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
                  value={form.get('data.legal_info.inn')}
                  errors={form.get('errors.legal_info.inn')}
                  onChange={(value) => form.set('data.legal_info.inn', value)}
                  onInvalid={(value) => form.set('errors.legal_info.inn', value)}
                  onValid={() => form.set('errors.legal_info.inn', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="оквэд"
                  validate={{ required: true }}
                  value={form.get('data.legal_info.okved')}
                  errors={form.get('errors.legal_info.okved')}
                  onChange={(value) => form.set('data.legal_info.okved', value)}
                  onInvalid={(value) => form.set('errors.legal_info.okved', value)}
                  onValid={() => form.set('errors.legal_info.okved', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="кпп"
                  type={INPUT_TYPES.number}
                  validate={{ required: true, minLen: 9, maxLen: 9 }}
                  value={form.get('data.legal_info.kpp')}
                  errors={form.get('errors.legal_info.kpp')}
                  onChange={(value) => form.set('data.legal_info.kpp', value)}
                  onInvalid={(value) => form.set('errors.legal_info.kpp', value)}
                  onValid={() => form.set('errors.legal_info.kpp', [])}
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
                  value={form.get('data.legal_info.supervisor')}
                  errors={form.get('errors.legal_info.supervisor')}
                  onChange={(value) => form.set('data.legal_info.supervisor', value)}
                  onInvalid={(value) => form.set('errors.legal_info.supervisor', value)}
                  onValid={() => form.set('errors.legal_info.supervisor', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="учредители"
                  validate={{ required: true }}
                  value={form.get('data.legal_info.founder')}
                  errors={form.get('errors.legal_info.founder')}
                  onChange={(value) => form.set('data.legal_info.founder', value)}
                  onInvalid={(value) => form.set('errors.legal_info.founder', value)}
                  onValid={() => form.set('errors.legal_info.founder', [])}
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
                  value={form.get('data.legal_info.authorized_capital')}
                  errors={form.get('errors.legal_info.authorized_capital')}
                  onChange={(value) => form.set('data.legal_info.authorized_capital', value)}
                  onInvalid={(value) => form.set('errors.legal_info.authorized_capital', value)}
                  onValid={() => form.set('errors.legal_info.authorized_capital', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="среднесписочная численность"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.legal_info.staff')}
                  errors={form.get('errors.legal_info.staff')}
                  onChange={(value) => form.set('data.legal_info.staff', value)}
                  onInvalid={(value) => form.set('errors.legal_info.staff', value)}
                  onValid={() => form.set('errors.legal_info.staff', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.block}>
                <Input
                  label="выручка за последний год"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.legal_info.revenue')}
                  errors={form.get('errors.legal_info.revenue')}
                  onChange={(value) => form.set('data.legal_info.revenue', value)}
                  onInvalid={(value) => form.set('errors.legal_info.revenue', value)}
                  onValid={() => form.set('errors.legal_info.revenue', [])}
                />
              </div>
              <div className={styles.block}>
                <Input
                  label="прибыль за последний год"
                  type={INPUT_TYPES.number}
                  validate={{ required: true }}
                  value={form.get('data.legal_info.profit')}
                  errors={form.get('errors.legal_info.profit')}
                  onChange={(value) => form.set('data.legal_info.profit', value)}
                  onInvalid={(value) => form.set('errors.legal_info.profit', value)}
                  onValid={() => form.set('errors.legal_info.profit', [])}
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
            const submit = form.submit(custodianApiPath + 'company/' + company, 'PATCH')
            submit.then(() => {
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
