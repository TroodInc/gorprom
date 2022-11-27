import { MobXProviderContext, observer } from 'mobx-react'
import { Fragment, useContext } from 'react'
import classNames from 'classnames'
import ProfileLayout from '../../../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../../../components/Input'
import { getApiPath } from '../../../../../helpers/fetch'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES, BUTTON_TYPES } from '../../../../../components/Button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import FileInput from '../../../../../components/FileInput'
import Icon, { ICONS_TYPES } from '../../../../../components/Icon'
import Select, { SELECT_TYPES } from '../../../../../components/Select'
import Checkbox from '../../../../../components/Checkbox'

const RequisitesEdit = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { profile: { company } } = store.authData

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const formStoreName = 'company' + company
  let formStore = store.formStore.has(formStoreName) ? store.formStore.get(formStoreName) : undefined

  const companyParams = {
    depth: 3,
    exclude: ['company_types', 'contact_set', 'product_set', 'work_type'],
  }
  const { get: getCompany, loaded } = store.callHttpQuery(
    custodianApiPath + 'company/' + company, {
      params: companyParams,
      cacheTime: Number.MAX_SAFE_INTEGER,
    }
  )
  const mainAddressId = getCompany('data.data.address.id')

  if (!formStore && loaded) {
    formStore = store.createFormStore(formStoreName, {
      form: {
        data: {
          logo: getCompany('data.data.logo'),
          legal_info: {
            ...getCompany('data.data.legal_info'),
            legal_address: getCompany('data.data.legal_info.legal_address.id') === mainAddressId ?
              mainAddressId : getCompany('data.data.legal_info.legal_address'),
          },
        },
      },
    })
  }

  if (!formStore) return null

  const { form } = formStore

  const getData = path => form.get('data.legal_info.' + path)
  const setData = (path, value) => form.set('data.legal_info.' + path, value)

  const getError = path => form.get('errors.legal_info.' + path)
  const setError = (path, value) => form.set('errors.legal_info.' + path, value)

  const logo = form.get('logo')

  const addressEqual = typeof getData('legal_address') === 'number'

  const getAddress = path => {
    if (addressEqual) return getCompany('data.data.address.' + path)
    return getData('legal_address.' + path)
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.left}>
          {logo &&
            <Image
              alt='Logo'
              src={logo}
              height={172}
              width={172}
              className={styles.image}
              objectFit="contain"
            />
          }
          <FileInput
            endpoint={fileApiPath + 'files/'}
            onUpload={({ file_url }) => form.set('logo', file_url)}
          >
            {!logo &&
              <div className={styles.addPhoto}>
                <Icon
                  className={styles.addPhotoIcon}
                  size={62}
                  type={ICONS_TYPES.photo}
                />
                <div className={styles.addPhotoLabel}>Загрузить фото</div>
              </div>
            }
            {logo &&
              <Button
                className={styles.addPhotoBtnContainer}
                type={BUTTON_TYPES.text}
                // specialType={BUTTON_SPECIAL_TYPES.upload}
                color={BUTTON_COLORS.orange}
                label={
                  <div className={styles.addPhotoBtn}>
                    <Icon
                      size={24}
                      type={ICONS_TYPES.upload}
                    />
                    <div className={styles.btnLabel}>Заменить</div>
                  </div>
                }
              />
            }
          </FileInput>
        </div>
        <div className={styles.right}>
          <div className={styles.block}>
            <div className={styles.row}>
              <div className={styles.cell}>
                <div className={styles.title}>
                  Юридический адрес
                </div>
              </div>
              <div className={styles.cell}>
                <Checkbox
                  label="Адрес совпадает с фактическим"
                  value={addressEqual}
                  onChange={v => setData('legal_address', v ? mainAddressId : {})}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  disabled={addressEqual}
                  label="Регион / район"
                  value={getAddress('region')}
                  errors={getError('legal_address.region')}
                  onChange={(value) => setData('legal_address.region', value)}
                  onInvalid={(value) => setError('legal_address.region', value)}
                  onValid={() => setError('legal_address.region', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  disabled={addressEqual}
                  label="Город / н.п."
                  value={getAddress('city')}
                  errors={getError('legal_address.city')}
                  onChange={(value) => setData('legal_address.city', value)}
                  onInvalid={(value) => setError('legal_address.city', value)}
                  onValid={() => setError('legal_address.city', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  disabled={addressEqual}
                  label="Улица"
                  value={getAddress('street')}
                  errors={getError('legal_address.street')}
                  onChange={(value) => setData('legal_address.street', value)}
                  onInvalid={(value) => setError('legal_address.street', value)}
                  onValid={() => setError('legal_address.street', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  disabled={addressEqual}
                  label="Дом"
                  value={getAddress('house')}
                  errors={getError('legal_address.house')}
                  onChange={(value) => setData('legal_address.house', value)}
                  onInvalid={(value) => setError('legal_address.house', value)}
                  onValid={() => setError('legal_address.house', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cellFull}>
                <Input
                  disabled={addressEqual}
                  label="Дополнительная информация (кабинет / офис / квартира / другое)"
                  value={getAddress('flat')}
                  errors={getError('legal_address.flat')}
                  onChange={(value) => setData('legal_address.flat', value)}
                  onInvalid={(value) => setError('legal_address.flat', value)}
                  onValid={() => setError('legal_address.flat', [])}
                />
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Реквизиты
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="ИНН"
                  type={INPUT_TYPES.number}
                  value={getData('inn')}
                  errors={getError('inn')}
                  onChange={(value) => setData('inn', value)}
                  onInvalid={(value) => setError('inn', value)}
                  onValid={() => setError('inn', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="КПП"
                  type={INPUT_TYPES.number}
                  value={getData('kpp')}
                  errors={getError('kpp')}
                  onChange={(value) => setData('kpp', value)}
                  onInvalid={(value) => setError('kpp', value)}
                  onValid={() => setError('kpp', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="ОКВЭД"
                  value={getData('okved')}
                  errors={getError('okved')}
                  onChange={(value) => setData('okved', value)}
                  onInvalid={(value) => setError('okved', value)}
                  onValid={() => setError('okved', [])}
                />
              </div>
              <div className={styles.cell} />
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Сотрудники
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="Руководитель"
                  value={getData('supervisor')}
                  errors={getError('supervisor')}
                  onChange={(value) => setData('supervisor', value)}
                  onInvalid={(value) => setError('supervisor', value)}
                  onValid={() => setError('supervisor', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="Учредитель"
                  value={getData('founder')}
                  errors={getError('founder')}
                  onChange={(value) => setData('founder', value)}
                  onInvalid={(value) => setError('founder', value)}
                  onValid={() => setError('founder', [])}
                />
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Финансовая информация
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="Уставной капитал"
                  type={INPUT_TYPES.moneyNumber}
                  value={getData('authorized_capital')}
                  errors={getError('authorized_capital')}
                  onChange={(value) => setData('authorized_capital', value)}
                  onInvalid={(value) => setError('authorized_capital', value)}
                  onValid={() => setError('authorized_capital', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="Численность персонала"
                  type={INPUT_TYPES.number}
                  value={getData('staff')}
                  errors={getError('staff')}
                  onChange={(value) => setData('staff', value)}
                  onInvalid={(value) => setError('staff', value)}
                  onValid={() => setError('staff', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="Выручка за последний год"
                  type={INPUT_TYPES.moneyNumber}
                  value={getData('revenue')}
                  errors={getError('revenue')}
                  onChange={(value) => setData('revenue', value)}
                  onInvalid={(value) => setError('revenue', value)}
                  onValid={() => setError('revenue', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="Дата регистрации"
                  type={INPUT_TYPES.date}
                  value={getData('registration_date')}
                  errors={getError('registration_date')}
                  onChange={(value) => setData('registration_date', value)}
                  onInvalid={(value) => setError('registration_date', value)}
                  onValid={() => setError('registration_date', [])}
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
          onClick={() => store.deleteFormStore(formStoreName)}
        />
      </div>
    </>
  )
}

RequisitesEdit.SubLayout = ProfileLayout

export default observer(RequisitesEdit)
