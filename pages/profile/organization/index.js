import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../components/Input'
import Icon, { ICONS_TYPES } from '../../../components/Icon'
import Select, { SELECT_TYPES, LIST_TYPES } from '../../../components/Select'
import Button, { BUTTON_TYPES, BUTTON_COLORS, BUTTON_SPECIAL_TYPES } from '../../../components/Button'
import FileInput from '../../../components/FileInput'
import { getApiPath } from '../../../helpers/fetch'


const CONTACT_TYPES = [
  { value: 'Приемная' },
  { value: 'Снабжение' },
  { value: 'Продажи' },
  { value: 'Логистика' },
  { value: 'Маркетинг/администрация' },
]

const Organization = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { id, profile: { company } } = store.authData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => store.deleteFormStore(formStoreName), [])

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const formStoreName = 'company' + (id || '')
  let formStore = store.formStore.has(formStoreName) ? store.formStore.get(formStoreName) : undefined

  if (!formStore) {
    if (company) {
      const { get, loaded } = store.callHttpQuery(custodianApiPath + 'company/' + company)
      if (loaded) {
        const companyData = get('data.data')
        const companyEditData = {
          id: companyData.id,
          address: companyData.address,
          company_types: companyData.company_types.map(t => t.id),
          contact_set: companyData.contact_set,
          corp_mail: companyData.corp_mail,
          department_type: companyData.department_type.id,
          logo: companyData.logo,
          name: companyData.name,
          ownership_type: companyData.ownership_type.id,
          parent_company: companyData.parent_company,
          work_type: companyData.work_type.map(t => t.id),
        }
        formStore = store.createFormStore(formStoreName, {
          form: {
            data: {
              id,
              profile: {
                company: companyEditData,
              },
            },
          },
        })
      }
    } else {
      const companyEditData = {
        creator: id,
        address: {},
        company_types: [],
        contact_set: [],
        legal_info: {},
        work_type: [],
      }
      formStore = store.createFormStore(formStoreName, {
        form: {
          data: {
            id,
            profile: {
              company: companyEditData,
            },
          },
        },
      })
    }
  }

  if (!formStore) return null

  const { form } = formStore

  const ownershipType = store.callHttpQuery(custodianApiPath + 'ownership_type', {
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const ownershipTypeArray = ownershipType.get('data.data') || []

  const departmentType = store.callHttpQuery(custodianApiPath + 'department_type', {
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const departmentTypeArray = departmentType.get('data.data') || []

  const companyType = store.callHttpQuery(custodianApiPath + 'company_type', {
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const companyTypeArray = companyType.get('data.data') || []

  const workType = store.callHttpQuery(custodianApiPath + 'work_type', {
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const workTypeArray = workType.get('data.data') || []

  return (
    <>
      <div className={styles.root}>
        <div className={styles.main}>
          <div className={styles.row}>
            <div className={styles.cell}>
              <div className={styles.left}>
                <Image
                  alt='Logo'
                  src={form.get('data.profile.company.logo') || '/image/defaultLogo.jpg'}
                  height={170}
                  width={300}
                  objectFit="cover"
                />
                <FileInput
                  endpoint={fileApiPath + 'files/'}
                  onUpload={({ file_url }) => form.set('data.profile.company.logo', file_url)}
                >
                  <Button
                    type={BUTTON_TYPES.text}
                    specialType={BUTTON_SPECIAL_TYPES.upload}
                    color={BUTTON_COLORS.orange}
                    label="Заменить"
                  />
                </FileInput>
              </div>
            </div>
            <div className={styles.cell}>
              <Input
                label="Название"
                validate={{ required: true }}
                value={form.get('data.profile.company.name')}
                errors={form.get('errors.profile.company.name')}
                onChange={(value) => form.set('data.profile.company.name', value)}
                onInvalid={(value) => form.set('errors.profile.company.name', value)}
                onValid={() => form.set('errors.profile.company.name', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Select
                validate={{ required: true, checkOnBlur: true }}
                type={SELECT_TYPES.filterDropdown}
                label="Форма собственности"
                placeholder="Укажите форму собственности"
                items={ownershipTypeArray.map(item => ({
                  value: item.id,
                  label: item.name,
                }))}
                values={form.get('data.profile.company.ownership_type') ?
                  [form.get('data.profile.company.ownership_type')] : []}
                errors={form.get('errors.profile.company.ownership_type')}
                onChange={(values) => form.set('data.profile.company.ownership_type', values[0] || null)}
                onInvalid={(value) => form.set('errors.profile.company.ownership_type', value)}
                onValid={() => form.set('errors.profile.company.ownership_type', [])}
              />
            </div>
            <div className={styles.cell}>
              <Select
                clearable
                type={SELECT_TYPES.filterDropdown}
                label="Структура организации"
                placeholder="Укажите структуру организации"
                items={departmentTypeArray.map(item => ({
                  value: item.id,
                  label: item.name,
                }))}
                values={form.get('data.profile.company.department_type') ?
                  [form.get('data.profile.company.department_type')] : []}
                errors={form.get('errors.profile.company.department_type')}
                onChange={(values) => form.set('data.profile.company.department_type', values[0] || null)}
                onInvalid={(value) => form.set('errors.profile.company.department_type', value)}
                onValid={() => form.set('errors.profile.company.department_type', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Select
                multi
                type={SELECT_TYPES.list}
                listType={LIST_TYPES.checkbox}
                label="Тип организации"
                placeholder="Укажите тип организации"
                items={companyTypeArray.map(item => ({
                  value: item.id,
                  label: item.name,
                }))}
                values={form.get('data.profile.company.company_types')}
                errors={form.get('errors.profile.company.company_types')}
                onChange={(values) => form.set('data.profile.company.company_types', values || [])}
                onInvalid={(value) => form.set('errors.profile.company.company_types', value)}
                onValid={() => form.set('errors.profile.company.company_types', [])}
              />
            </div>
            <div className={styles.cell}>
              <Select
                multi
                type={SELECT_TYPES.list}
                listType={LIST_TYPES.checkbox}
                label="Тип деятельности"
                placeholder="Укажите тип деятельности"
                items={workTypeArray.map(item => ({
                  value: item.id,
                  label: item.name,
                }))}
                values={form.get('data.profile.company.work_type')}
                errors={form.get('errors.profile.company.work_type')}
                onChange={(values) => form.set('data.profile.company.work_type', values || [])}
                onInvalid={(value) => form.set('errors.profile.company.work_type', value)}
                onValid={() => form.set('errors.profile.company.work_type', [])}
              />
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.cell}>
              Адрес
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Input
                label="Регион / район"
                value={form.get('data.profile.company.address.region')}
                errors={form.get('errors.profile.company.address.region')}
                onChange={(value) => form.set('data.profile.company.address.region', value)}
                onInvalid={(value) => form.set('errors.profile.company.address.region', value)}
                onValid={() => form.set('errors.profile.company.address.region', [])}
              />
            </div>
            <div className={styles.cell}>
              <Input
                label="Город / н.п."
                value={form.get('data.profile.company.address.city')}
                errors={form.get('errors.profile.company.address.city')}
                onChange={(value) => form.set('data.profile.company.address.city', value)}
                onInvalid={(value) => form.set('errors.profile.company.address.city', value)}
                onValid={() => form.set('errors.profile.company.address.city', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Input
                label="Улица"
                value={form.get('data.profile.company.address.street')}
                errors={form.get('errors.profile.company.address.street')}
                onChange={(value) => form.set('data.profile.company.address.street', value)}
                onInvalid={(value) => form.set('errors.profile.company.address.street', value)}
                onValid={() => form.set('errors.profile.company.address.street', [])}
              />
            </div>
            <div className={styles.cell}>
              <Input
                label="Дом"
                value={form.get('data.profile.company.address.house')}
                errors={form.get('errors.profile.company.address.house')}
                onChange={(value) => form.set('data.profile.company.address.house', value)}
                onInvalid={(value) => form.set('errors.profile.company.address.house', value)}
                onValid={() => form.set('errors.profile.company.address.house', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Input
                label="Квартира / офис"
                value={form.get('data.profile.company.address.flat')}
                errors={form.get('errors.profile.company.address.flat')}
                onChange={(value) => form.set('data.profile.company.address.flat', value)}
                onInvalid={(value) => form.set('errors.profile.company.address.flat', value)}
                onValid={() => form.set('errors.profile.company.address.flat', [])}
              />
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.cell}>
              Контакты
            </div>
          </div>
          <div className={styles.row}>
            <div className={classNames(styles.cell, styles.full)}>
              <Input
                label="Корпоративные почты"
                placeholder="@gmail.com, @yandex.ru"
                value={form.get('data.profile.company.corp_mail')}
                errors={form.get('errors.profile.company.corp_mail')}
                onChange={(value) => form.set('data.profile.corp_mail', value)}
                onInvalid={(value) => form.set('errors.profile.corp_mail', value)}
                onValid={() => form.set('errors.profile.company.corp_mail', [])}
              />
            </div>
          </div>
          {(form.get('data.profile.company.contact_set') || []).map((item, i) => (
            <div key={item.id || item.tmpId} className={styles.contactBlock}>
              <div className={styles.cell}>
                <Input
                  className={styles.contact}
                  type={INPUT_TYPES.phoneWithExt}
                  label="Номер телефона"
                  validate={{ required: true }}
                  value={form.get(`data.profile.company.contact_set.${i}.value`)}
                  errors={form.get(`errors.profile.company.contact_set.${i}.value`)}
                  onChange={(value) => form.set(`data.profile.company.contact_set.${i}.value`, value)}
                  onInvalid={(value) => form.set(`errors.profile.company.contact_set.${i}.value`, value)}
                  onValid={() => form.set(`errors.profile.company.contact_set.${i}.value`, [])}
                />
              </div>
              <div className={styles.split} />
              <div className={styles.cell}>
                <Select
                  className={styles.contactType}
                  clearable
                  type={SELECT_TYPES.filterDropdown}
                  label="Тип контакта"
                  placeholder="Укажите тип контакта"
                  items={CONTACT_TYPES}
                  values={form.get(`data.profile.company.contact_set.${i}.comment`) ?
                    [form.get(`data.profile.company.contact_set.${i}.comment`)] : []}
                  errors={form.get(`errors.profile.company.contact_set.${i}.comment`)}
                  onChange={(values) => form.set(`data.profile.company.contact_set.${i}.comment`, values[0] || null)}
                  onInvalid={(value) => form.set(`errors.profile.company.contact_set.${i}.comment`, value)}
                  onValid={() => form.set(`errors.profile.company.contact_set.${i}.comment`, [])}
                />
              </div>
              <div className={styles.split} />
              <Icon
                className={styles.icon}
                size={32}
                type={ICONS_TYPES.trashBin}
                onClick={() => {
                  const contactSet = form.get('data.profile.company.contact_set') || []
                  const newContactSet = []
                  const contactSetErrors = form.get('errors.profile.company.contact_set') || []
                  const newContactSetErrors = []

                  contactSet.forEach((_, j) => {
                    if (i !== j) {
                      newContactSet.push(contactSet[j])
                      newContactSetErrors.push(contactSetErrors[j])
                    }
                  })

                  form.set('data.profile.company.contact_set', newContactSet)
                  form.set('errors.profile.company.contact_set', newContactSetErrors)
                }}
              />
            </div>
          ))}
          <div className={styles.row}>
            <div className={styles.cell}>
              <Button
                className={styles.add}
                label="Добавить еще номер"
                type={BUTTON_TYPES.text}
                specialType={BUTTON_SPECIAL_TYPES.plus}
                color={BUTTON_COLORS.orange}
                onClick={() => {
                  const contactSet = form.get('data.profile.company.contact_set') || []
                  const newContactSet = [...contactSet, { type: 'PHONE' }]

                  form.set('data.profile.company.contact_set', newContactSet)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          label="Сохранить изменения"
          disabled={form.hasErrors}
          onClick={() => {
            const submit = id ? form.submit(authApiPath + 'account/' + id + '/', 'PATCH') :
              form.submit(authApiPath + 'account/', 'POST')
            submit.then(({ data }) => {
              store.setAuthData(data?.data)
              store.deleteFormStore(formStoreName)
            })
          }}
        />
        <Button
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться в профиль"
          link="/profile/profile"
        />
      </div>
    </>
  )
}

Organization.SubLayout = ProfileLayout

export default observer(Organization)
