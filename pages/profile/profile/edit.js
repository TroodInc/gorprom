import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'
import Input, { INPUT_TYPES } from '../../../components/Input'
import Select, { SELECT_TYPES } from '../../../components/Select'
import Button, { BUTTON_TYPES, BUTTON_COLORS, BUTTON_SPECIAL_TYPES } from '../../../components/Button'
import FileInput from '../../../components/FileInput'
import { getApiPath } from '../../../helpers/fetch'


const formStoreName = 'account'

const Profile = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const account = store.authData
  const router = useRouter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => store.deleteFormStore(formStoreName), [])

  const formStore = store.createFormStore(formStoreName, {
    form: {
      data: {
        login: account.login,
        profile: account.profile,
      },
    },
  })
  const { form } = formStore

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const fileApiPath = getApiPath(process.env.NEXT_PUBLIC_FILE_API, host)

  const companies = store.callHttpQuery(custodianApiPath + 'company', {
    cacheTime: Number.MAX_SAFE_INTEGER,
    params: {
      only: ['name', 'ownership_type', 'ownership_type.name'],
    },
  })

  //const loaded = companies.loaded
  const companiesArray = companies.get('data.data') || []

  return (
    <>
      <div className={styles.root}>
        <div className={classNames(styles.column, styles.left)}>
          <Image
            alt='Avatar'
            src={form.get('data.profile.avatar') || '/image/defaultAvatar.jpg'}
            height={300}
            width={300}
            style={{
              borderRadius: '50%',
            }}
            objectFit="cover"
          />
          <FileInput
            endpoint={fileApiPath + 'files/'}
            onUpload={({ file_url }) => form.set('data.profile.avatar', file_url)}
          >
            <Button
              type={BUTTON_TYPES.text}
              specialType={BUTTON_SPECIAL_TYPES.upload}
              color={BUTTON_COLORS.orange}
              label="Заменить"
            />
          </FileInput>
        </div>
        <div className={styles.column}>
          <Input
            label="Имя"
            value={form.get('data.profile.name')}
            errors={form.get('errors.profile.name')}
            onChange={(value) => form.set('data.profile.name', value)}
            onInvalid={(value) => form.set('errors.profile.name', value)}
            onValid={() => form.set('errors.profile.name', [])}
          />
          <Input
            label="Фамилия"
            value={form.get('data.profile.surname')}
            errors={form.get('errors.profile.surname')}
            onChange={(value) => form.set('data.profile.surname', value)}
            onInvalid={(value) => form.set('errors.profile.surname', value)}
            onValid={() => form.set('errors.profile.surname', [])}
          />
          <Input
            label="Отчество"
            value={form.get('data.profile.patronymic')}
            errors={form.get('errors.profile.patronymic')}
            onChange={(value) => form.set('data.profile.patronymic', value)}
            onInvalid={(value) => form.set('errors.profile.patronymic', value)}
            onValid={() => form.set('errors.profile.patronymic', [])}
          />
          <Input
            label="Должность"
            value={form.get('data.profile.position')}
            errors={form.get('errors.profile.position')}
            onChange={(value) => form.set('data.profile.position', value)}
            onInvalid={(value) => form.set('errors.profile.position', value)}
            onValid={() => form.set('errors.profile.position', [])}
          />
          <Button
            type={BUTTON_TYPES.text}
            color={BUTTON_COLORS.orange}
            label={form.get('data.profile.subscribe') ? 'Отписаться от рассылки' : 'Подписаться на рассылку'}
            onClick={() => form.set('data.profile.subscribe', !form.get('data.profile.subscribe'))}
          />
        </div>
        <div className={styles.column}>
          <Input
            label="Почта"
            type={INPUT_TYPES.email}
            value={form.get('data.login')}
            errors={form.get('errors.login')}
            validate={{ required: true, checkOnBlur: true }}
            onChange={(value) => {
              form.set('data.login', value)
              form.set('data.profile.mail', value)
            }}
            onInvalid={(value) => form.set('errors.login', value)}
            onValid={() => form.set('errors.login', [])}
          />
          <Input
            label="Дополнительная почта"
            value={form.get('data.profile.additional_mail')}
            errors={form.get('errors.profile.additional_mail')}
            onChange={(value) => form.set('data.profile.additional_mail', value)}
            onInvalid={(value) => form.set('errors.profile.additional_mail', value)}
            onValid={() => form.set('errors.profile.additional_mail', [])}
          />
          <Input
            label="Телефон"
            type={INPUT_TYPES.phone}
            value={form.get('data.profile.phone')}
            errors={form.get('errors.profile.phone')}
            onChange={(value) => form.set('data.profile.phone', value)}
            onInvalid={(value) => form.set('errors.profile.phone', value)}
            onValid={() => form.set('errors.profile.phone', [])}
          />
          <Select
            clearable
            type={SELECT_TYPES.filterDropdown}
            label="Место работы (организация)"
            placeholder="Укажите организацию"
            items={companiesArray.map(item => ({
              value: item.id,
              label: item.ownership_type.name + ' ' + item.name,
            }))}
            values={form.get('data.profile.company') ? [form.get('data.profile.company')] : []}
            errors={form.get('errors.profile.company')}
            onChange={(values) => form.set('data.profile.company', values[0] || null)}
            onInvalid={(value) => form.set('errors.profile.company', value)}
            onValid={() => form.set('errors.profile.company', [])}
          />
          {!account.profile.company && (
            <Button
              type={BUTTON_TYPES.text}
              specialType={BUTTON_SPECIAL_TYPES.plus}
              color={BUTTON_COLORS.orange}
              label="Добавить организацию"
              link="/profile/organization/edit"
            />
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          className={styles.submit}
          label="Сохранить изменения"
          disabled={form.hasErrors}
          onClick={() => {
            form.submit(authApiPath + 'account/' + account.id + '/', 'PATCH')
              .then(({ data }) => {
                store.setAuthData(data?.data)
                router.push('/profile/profile')
              })
          }}
        />
        <Button
          className={styles.submit}
          type={BUTTON_TYPES.border}
          label="< &nbsp; &nbsp; &nbsp; Вернуться в профиль"
          disabled={form.hasErrors}
          link="/profile/profile"
        />
      </div>
    </>
  )
}

Profile.SubLayout = ProfileLayout

export default observer(Profile)
