import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../../../components/Input'
import Icon, { ICONS_TYPES } from '../../../../../components/Icon'
import Select, { SELECT_TYPES } from '../../../../../components/Select'
import Button, { BUTTON_TYPES, BUTTON_COLORS, BUTTON_SPECIAL_TYPES } from '../../../../../components/Button'
import FileInput from '../../../../../components/FileInput'
import { getApiPath } from '../../../../../helpers/fetch'
import Link from '../../../../../components/Link'


const formStoreName = 'product'

const ProductEdit = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { profile: { company } } = store.authData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => store.deleteFormStore(formStoreName), [])

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const formStore = store.createFormStore(formStoreName, {
    form: {
      data: {
        company,
        photo_set: [],
        attribute_set: [],
      },
    },
  })

  const { form } = formStore

  const productType = store.callHttpQuery(custodianApiPath + 'product_type', {
    cacheTime: Number.MAX_SAFE_INTEGER,
  })
  const productTypeArray = productType.get('data.data') || []

  const productCategory = store.callHttpQuery(custodianApiPath + 'product_category', {
    cacheTime: Number.MAX_SAFE_INTEGER,
    params: {
      q: 'not(is_null(childs.id,false))',
    },
  })
  const productCategoryArray = productCategory.get('data.data') || []

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
              <div>{'<'}</div>
              <div>финансовая информация</div>
            </div>
          </Link>
          <Link
            className={styles.productsLink}
            href={'/profile/organization/products'}
          >
            <div className={styles.linkContent}>
              <div>товары</div>
            </div>
          </Link>
        </div>
        <div className={styles.main}>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Input
                label="Название"
                validate={{ required: true, checkOnBlur: true }}
                value={form.get('data.name')}
                errors={form.get('errors.name')}
                onChange={(value) => form.set('data.name', value)}
                onInvalid={(value) => form.set('errors.name', value)}
                onValid={() => form.set('errors.name', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <Select
                validate={{ required: true, checkOnBlur: true }}
                type={SELECT_TYPES.filterDropdown}
                label="Тип"
                placeholder="Укажите тип"
                items={productTypeArray.map(item => ({
                  value: item.id,
                  label: item.name,
                }))}
                values={form.get('data.type') ?
                  [form.get('data.type')] : []}
                errors={form.get('errors.type')}
                onChange={(values) => form.set('data.type', values[0] || null)}
                onInvalid={(value) => form.set('errors.type', value)}
                onValid={() => form.set('errors.type', [])}
              />
            </div>
            <div className={styles.cell}>
              <Select
                validate={{ required: true, checkOnBlur: true }}
                type={SELECT_TYPES.filterDropdown}
                label="Категория"
                placeholder="Укажите категорию"
                items={productCategoryArray.map(item => ({
                  value: item.id,
                  label: item.parent ? `${item.name} (${item.parent.name})` : item.name,
                }))}
                values={form.get('data.category') ?
                  [form.get('data.category')] : []}
                errors={form.get('errors.category')}
                onChange={(values) => form.set('data.category', values[0] || null)}
                onInvalid={(value) => form.set('errors.category', value)}
                onValid={() => form.set('errors.category', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={classNames(styles.cell, styles.full)}>
              <Input
                label="Краткое описание"
                type={INPUT_TYPES.multi}
                minRows={2}
                value={form.get('data.teaser')}
                errors={form.get('errors.teaser')}
                onChange={(value) => form.set('data.teaser', value)}
                onInvalid={(value) => form.set('errors.teaser', value)}
                onValid={() => form.set('errors.teaser', [])}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={classNames(styles.cell, styles.full)}>
              <Input
                label="Полное описание"
                type={INPUT_TYPES.multi}
                minRows={5}
                value={form.get('data.description')}
                errors={form.get('errors.description')}
                onChange={(value) => form.set('data.description', value)}
                onInvalid={(value) => form.set('errors.description', value)}
                onValid={() => form.set('errors.description', [])}
              />
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.cell}>
              Параметры
            </div>
          </div>
          {(form.get('data.attribute_set') || []).map((item, i) => (
            <div key={item.id || item.tmpId} className={styles.contactBlock}>
              <div className={styles.cell}>
                <Input
                  label="Название параметра"
                  placeholder="Вес, кг"
                  validate={{ required: true, checkOnBlur: true }}
                  value={form.get(`data.attribute_set.${i}.name`)}
                  errors={form.get(`errors.attribute_set.${i}.name`)}
                  onChange={(value) => form.set(`data.attribute_set.${i}.name`, value)}
                  onInvalid={(value) => form.set(`errors.attribute_set.${i}.name`, value)}
                  onValid={() => form.set(`errors.attribute_set.${i}.name`, [])}
                />
              </div>
              <div className={styles.split} />
              <div className={styles.cell}>
                <Input
                  label="Значение"
                  placeholder="10"
                  validate={{ required: true, checkOnBlur: true }}
                  value={form.get(`data.attribute_set.${i}.value`)}
                  errors={form.get(`errors.attribute_set.${i}.value`)}
                  onChange={(value) => form.set(`data.attribute_set.${i}.value`, value)}
                  onInvalid={(value) => form.set(`errors.attribute_set.${i}.value`, value)}
                  onValid={() => form.set(`errors.attribute_set.${i}.value`, [])}
                />
              </div>
              <div className={styles.split} />
              <Icon
                className={styles.icon}
                size={32}
                type={ICONS_TYPES.trashBin}
                onClick={() => {
                  const attributeSet = form.get('data.attribute_set') || []
                  const newAttributeSet = []
                  const attributeSetErrors = form.get('errors.attribute_set') || []
                  const newAttributeSetErrors = []

                  attributeSet.forEach((_, j) => {
                    if (i !== j) {
                      newAttributeSet.push(attributeSet[j])
                      newAttributeSetErrors.push(attributeSetErrors[j])
                    }
                  })

                  form.set('data.attribute_set', newAttributeSet)
                  form.set('errors.attribute_set', newAttributeSetErrors)
                }}
              />
            </div>
          ))}
          <div className={styles.row}>
            <div className={styles.cell}>
              <Button
                className={styles.add}
                label="Добавить еще параметр"
                type={BUTTON_TYPES.text}
                specialType={BUTTON_SPECIAL_TYPES.plus}
                color={BUTTON_COLORS.orange}
                onClick={() => {
                  const attributeSet = form.get('data.attribute_set') || []
                  const newAttributeSet = [...attributeSet, { tmpId: Date.now() }]

                  form.set('data.attribute_set', newAttributeSet)
                }}
              />
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.cell}>
              Фото
            </div>
          </div>
          {!!form.get('data.photo_set').length && (
            <div className={styles.photoRow}>
              {(form.get('data.photo_set') || []).map((item, i) => (
                <div key={item.link} className={styles.photo}>
                  <Image
                    alt={'Photo' + (i + 1)}
                    src={item.link}
                    width={190}
                    height={110}
                    objectFit="cover"
                  />
                  <Icon
                    className={styles.icon}
                    size={32}
                    type={ICONS_TYPES.trashBin}
                    onClick={() => {
                      const photoSet = form.get('data.photo_set') || []
                      const newPhotoSet = []
                      const photoSetErrors = form.get('errors.photo_set') || []
                      const newPhotoSetErrors = []

                      photoSet.forEach((_, j) => {
                        if (i !== j) {
                          newPhotoSet.push(photoSet[j])
                          newPhotoSetErrors.push(photoSetErrors[j])
                        }
                      })

                      form.set('data.photo_set', newPhotoSet)
                      form.set('errors.photo_set', newPhotoSetErrors)
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className={styles.row}>
            <div className={styles.cell}>
              <FileInput
                className={styles.add}
                endpoint={fileApiPath + 'files/'}
                onUpload={({ file_url }) =>
                  form.set(`data.photo_set.${form.get('data.photo_set').length}.link`, file_url)
                }
              >
                <Button
                  className={styles.add}
                  type={BUTTON_TYPES.text}
                  specialType={BUTTON_SPECIAL_TYPES.upload}
                  color={BUTTON_COLORS.orange}
                  label="Добавить еще фото"
                />
              </FileInput>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          label="Сохранить изменения"
          disabled={form.hasErrors}
          onClick={() => {
            form.submit(custodianApiPath + 'product', 'POST')
              .then(({ data }) => {
                store.deleteFormStore(formStoreName)
                router.push('/profile/organization/products')
              })
          }}
        />
        <Button
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться к товарам"
          link="/profile/organization/products"
        />
      </div>
    </>
  )
}

ProductEdit.SubLayout = ProfileLayout

export default observer(ProductEdit)
