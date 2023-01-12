import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, Fragment } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ProfileLayout from '../../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../../components/Input'
import Icon, { ICONS_TYPES } from '../../../../components/Icon'
import Select, { SELECT_TYPES } from '../../../../components/Select'
import Button, { BUTTON_TYPES, BUTTON_COLORS, BUTTON_SPECIAL_TYPES } from '../../../../components/Button'
import Checkbox from '../../../../components/Checkbox'
import FileInput from '../../../../components/FileInput'
import { getApiPath } from '../../../../helpers/fetch'


const CONTACT_TYPES = [
  { value: 'Приемная' },
  { value: 'Снабжение' },
  { value: 'Продажи' },
  { value: 'Логистика' },
  { value: 'Маркетинг/администрация' },
]

const Organization = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { id, profile: { company } } = store.authData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => store.deleteFormStore(formStoreName), [])

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const formStoreName = 'company' + (company || '')
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
          corp_domain_set: companyData.corp_domain_set,
          site: companyData.site,
          department_type: companyData.department_type?.id,
          logo: companyData.logo,
          name: companyData.name,
          ownership_type: companyData.ownership_type?.id,
          parent_company: companyData.parent_company?.id,
          work_type: companyData.work_type.map(t => t.id),
          other_work_type: companyData.other_work_type,
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
        contact_set: [{ type: 'PHONE', tmpId: Date.now() }],
        legal_info: {},
        work_type: [],
        corp_domain_set: [],
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

  const workType = store.callHttpQuery(custodianApiPath + 'work_type', {
    params: {
      q: 'sort(category,order,name)',
    },
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const workTypeArray = workType.get('data.data') || []
  const workTypeByCategory = workTypeArray.reduce((memo, item, i) => {
    const category = item.category.id
    const categoryCount = memo[category]?.count || 0
    const categoryItems = memo[category]?.items || []

    const newItem = {
      id: item.id,
      name: item.name,
    }

    return {
      ...memo,
      [category]: {
        id: category,
        name: item.category.name,
        count: categoryCount + 1,
        items: [
          ...categoryItems,
          newItem,
        ],
      },
    }
  }, {})

  const getData = path => form.get('data.profile.company.' + path)
  const setData = (path, value) => form.set('data.profile.company.' + path, value)

  const getError = path => form.get('errors.profile.company.' + path)
  const setError = (path, value) => form.set('errors.profile.company.' + path, value)

  const logo = getData('logo')
  const corpDomainSet = getData('corp_domain_set') || []
  const selectedWorkType = getData('work_type') || []

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
            onUpload={({ file_url }) => setData('logo', file_url)}
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
                <Input
                  label="Название"
                  validate={{ required: true, checkOnBlur: true }}
                  value={getData('name')}
                  errors={getError('name')}
                  onChange={(value) => setData('name', value)}
                  onInvalid={(value) => setError('name', value)}
                  onValid={() => setError('name', [])}
                />
              </div>
              <div className={styles.cell} />
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
                  values={getData('ownership_type') ? [getData('ownership_type')] : []}
                  errors={getError('ownership_type')}
                  onChange={(values) => setData('ownership_type', values[0] || null)}
                  onInvalid={(value) => setError('ownership_type', value)}
                  onValid={() => setError('ownership_type', [])}
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
                  values={getData('department_type') ? [getData('department_type')] : []}
                  errors={getError('department_type')}
                  onChange={(values) => setData('department_type', values[0] || null)}
                  onInvalid={(value) => setError('department_type', value)}
                  onValid={() => setError('department_type', [])}
                />
              </div>
            </div>
          </div>
          <div className={styles.checkboxBlock}>
            <div className={styles.title}>
              Выберите тип деятельности
            </div>
            {Object.values(workTypeByCategory).map(({ id, name, count, items }) => {
              const halfCount = Math.ceil(count / 2)
              const mapArray = Array(halfCount).fill(undefined)

              return (
                <Fragment key={id}>
                  <div className={styles.subTitle}>
                    {name}
                  </div>
                  {mapArray.map((_, i) => {
                    const first = items[i * 2]
                    const second = items[(i * 2) + 1]
                    return (
                      <div key={first.id} className={styles.row}>
                        <div className={styles.cell}>
                          <Checkbox
                            label={first.name}
                            value={selectedWorkType.includes(first.id)}
                            onChange={v =>
                              setData(
                                'work_type',
                                v ? [...selectedWorkType, first.id] : selectedWorkType.filter(i => i !== first.id),
                              )
                            }
                          />
                        </div>
                        <div className={styles.cell}>
                          {second && (
                            <Checkbox
                              label={second.name}
                              value={selectedWorkType.includes(second.id)}
                              onChange={v =>
                                setData(
                                  'work_type',
                                  v ? [...selectedWorkType, second.id] : selectedWorkType.filter(i => i !== second.id),
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              )
            })}
            <div className={styles.subTitle}>
              Другое
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  placeholder="Введите свой вариант"
                  value={getData('other_work_type')}
                  errors={getError('other_work_type')}
                  onChange={(value) => setData('other_work_type', value)}
                  onInvalid={(value) => setError('other_work_type', value)}
                  onValid={() => setError('other_work_type', [])}
                />
              </div>
              <div className={styles.cell} />
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Адрес
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="Регион / район"
                  value={getData('address.region')}
                  errors={getError('address.region')}
                  onChange={(value) => setData('address.region', value)}
                  onInvalid={(value) => setError('address.region', value)}
                  onValid={() => setError('address.region', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="Город / н.п."
                  value={getData('address.city')}
                  errors={getError('address.city')}
                  onChange={(value) => setData('address.city', value)}
                  onInvalid={(value) => setError('address.city', value)}
                  onValid={() => setError('address.city', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cell}>
                <Input
                  label="Улица"
                  value={getData('address.street')}
                  errors={getError('address.street')}
                  onChange={(value) => setData('address.street', value)}
                  onInvalid={(value) => setError('address.street', value)}
                  onValid={() => setError('address.street', [])}
                />
              </div>
              <div className={styles.cell}>
                <Input
                  label="Дом"
                  value={getData('address.house')}
                  errors={getError('address.house')}
                  onChange={(value) => setData('address.house', value)}
                  onInvalid={(value) => setError('address.house', value)}
                  onValid={() => setError('address.house', [])}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.cellFull}>
                <Input
                  label="Дополнительная информация (кабинет / офис / квартира / другое)"
                  value={getData('address.flat')}
                  errors={getError('address.flat')}
                  onChange={(value) => setData('address.flat', value)}
                  onInvalid={(value) => setError('address.flat', value)}
                  onValid={() => setError('address.flat', [])}
                />
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Контакты
            </div>
            <div className={styles.row}>
              <div className={styles.cellFull}>
                <Input
                  type={INPUT_TYPES.url}
                  label="Сайт"
                  value={getData('site')}
                  errors={getError('site')}
                  onChange={(value) => setData('site', value)}
                  onInvalid={(value) => setError('site', value)}
                  onValid={() => setError('site', [])}
                />
              </div>
            </div>
            {(getData('contact_set') || []).map((item, i) => (
              <div key={item.id || item.tmpId} className={styles.row}>
                <div className={styles.cellFull}>
                  <div className={styles.contactBlock}>
                    <div className={styles.cell}>
                      <Input
                        inputClassName={styles.inputLeft}
                        labelClassName={styles.inputLeftLabel}
                        type={INPUT_TYPES.phoneWithExt}
                        label="Номер телефона"
                        validate={{ required: true, checkOnBlur: true }}
                        value={getData(`contact_set.${i}.value`)}
                        errors={getError(`contact_set.${i}.value`)}
                        onChange={(value) => setData(`contact_set.${i}.value`, value)}
                        onInvalid={(value) => setError(`contact_set.${i}.value`, value)}
                        onValid={() => setError(`contact_set.${i}.value`, [])}
                      />
                    </div>
                    <div className={styles.split}/>
                    <div className={styles.cell}>
                      <Select
                        className={styles.selectRight}
                        clearable
                        type={SELECT_TYPES.filterDropdown}
                        label="Тип контакта"
                        placeholder="Укажите тип контакта"
                        items={CONTACT_TYPES}
                        values={getData(`contact_set.${i}.comment`) ?
                          [getData(`contact_set.${i}.comment`)] : []}
                        errors={getError(`contact_set.${i}.comment`)}
                        onChange={(values) => setData(`contact_set.${i}.comment`, values[0] || null)}
                        onInvalid={(value) => setError(`contact_set.${i}.comment`, value)}
                        onValid={() => setError(`contact_set.${i}.comment`, [])}
                      />
                    </div>
                    <Icon
                      className={styles.icon}
                      size={14}
                      type={ICONS_TYPES.clear}
                      onClick={() => {
                        const contactSet = getData('contact_set') || []
                        const newContactSet = []
                        const contactSetErrors = getError('contact_set') || []
                        const newContactSetErrors = []

                        contactSet.forEach((_, j) => {
                          if (i !== j) {
                            newContactSet.push(contactSet[j])
                            newContactSetErrors.push(contactSetErrors[j])
                          }
                        })

                        setData('contact_set', newContactSet)
                        setError('contact_set', newContactSetErrors)
                      }}
                    />
                  </div>
                </div>
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
                    const contactSet = getData('contact_set') || []
                    const newContactSet = [...contactSet, { type: 'PHONE', tmpId: Date.now() }]

                    setData('contact_set', newContactSet)
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              Настройки администратора
            </div>
            {corpDomainSet.map((item, i) => {
              if (i % 2) return null
              const first = corpDomainSet[i]
              const second = corpDomainSet[i + 1]
              return (
                <div key={first.id || first.tmpId} className={styles.row}>
                  <div className={styles.cell}>
                    <Input
                      label="Домен корпоративной почты"
                      validate={{ required: true, checkOnBlur: true }}
                      value={getData(`corp_domain_set.${i}.domain`)}
                      errors={getError(`corp_domain_set.${i}.domain`)}
                      onChange={(value) => setData(`corp_domain_set.${i}.domain`, value)}
                      onInvalid={(value) => setError(`corp_domain_set.${i}.domain`, value)}
                      onValid={() => setError(`corp_domain_set.${i}.domain`, [])}
                    />
                  </div>
                  <div className={styles.cell}>
                    {second && (
                      <Input
                        label="Домен корпоративной почты"
                        validate={{ required: true, checkOnBlur: true }}
                        value={getData(`corp_domain_set.${i + 1}.domain`)}
                        errors={getError(`corp_domain_set.${i + 1}.domain`)}
                        onChange={(value) => setData(`corp_domain_set.${i + 1}.domain`, value)}
                        onInvalid={(value) => setError(`corp_domain_set.${i + 1}.domain`, value)}
                        onValid={() => setError(`corp_domain_set.${i + 1}.domain`, [])}
                      />
                    )}
                  </div>
                </div>
              )
            })}
            <div className={styles.row}>
              <div className={styles.cell}>
                <Button
                  className={styles.add}
                  label="Добавить еще домен"
                  type={BUTTON_TYPES.text}
                  specialType={BUTTON_SPECIAL_TYPES.plus}
                  color={BUTTON_COLORS.orange}
                  onClick={() => setData('corp_domain_set', [...corpDomainSet, { tmpId: Date.now() }])}
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
            const submit = id ? form.submit(authApiPath + 'account/' + id + '/', 'PATCH') :
              form.submit(authApiPath + 'account/', 'POST')
            submit.then(({ data }) => {
              store.setAuthData(data?.data)
              store.deleteFormStore(formStoreName)
              router.push('/profile/organization')
            })
          }}
        />
        <Button
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться в профиль"
          link="/profile/organization"
          onClick={() => store.deleteFormStore(formStoreName)}
        />
      </div>
    </>
  )
}

Organization.SubLayout = ProfileLayout

export default observer(Organization)
