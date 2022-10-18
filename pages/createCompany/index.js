import React, { useContext } from 'react'
import styles from './index.module.css'
import Head from 'next/head'
import Input, { INPUT_TYPES } from '../../components/Input'
import Button, { BUTTON_COLORS, BUTTON_TYPES } from '../../components/Button'
import { MobXProviderContext, observer } from 'mobx-react'

const formStoreName = 'company'

const CreateCompany = () => {
  const { store } = useContext(MobXProviderContext)

  const formStore = store.createFormStore(formStoreName)
  const { form } = formStore

  const globalError = form.get('errors.globalError')

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Добавить организацию</title>
      </Head>
      <div className={styles.header}>Добавить организацию</div>
      <Input
        className={styles.name}
        label="Название"
        type={INPUT_TYPES.text}
        value={form.get('data.name')}
        errors={form.get('errors.name')}
        validate={{ required: true }}
        onChange={(value) => form.set('data.name', value)}
        onInvalid={(value) => form.set('errors.name', value)}
        onValid={() => form.set('errors.name', [])}
      />
      <Input
        className={styles.desc}
        label="Описание"
        type={INPUT_TYPES.multi}
        minRows={8}
        value={form.get('data.product.description')}
        errors={form.get('errors.product.description')}
        validate={{ required: false }}
        onChange={(value) => form.set('data.product.description', value)}
        onInvalid={(value) => form.set('errors.product.description', value)}
        onValid={() => form.set('errors.product.description', [])}
      />
      <span className={styles.descLabel}>макс. 350 символов</span>
      <div className={styles.contactsHeader}>Контактная информация</div>
      <Input
        className={styles.email}
        label="Почта"
        type={INPUT_TYPES.email}
        value={form.get('data.contact_set[0].value')}
        errors={form.get('errors.contact_set[0].value')}
        validate={{ required: true }}
        onChange={(value) => {
          form.set('data.contact_set[0].value', value)
          form.set('data.contact_set[0].type.name', 'email')
        }}
        onInvalid={(value) => form.set('errors.contact_set[0].value', value)}
        onValid={() => form.set('errors.contact_set[0].value', [])}
      />
      <Input
        className={styles.phone}
        label="Телефон"
        type={INPUT_TYPES.phone}
        value={form.get('data.phone')}
        errors={form.get('errors.phone')}
        validate={{ required: true }}
        onChange={(value) => form.set('data.phone', value)}
        onInvalid={(value) => form.set('errors.phone', value)}
        onValid={() => form.set('errors.phone', [])}
      />
      <Input
        className={styles.website}
        label="Вебсайт"
        type={INPUT_TYPES.url}
        value={form.get('data.website')}
        errors={form.get('errors.website')}
        validate={{ required: true }}
        onChange={(value) => form.set('data.website', value)}
        onInvalid={(value) => form.set('errors.website', value)}
        onValid={() => form.set('errors.website', [])}
      />
      <Button
        className={styles.addSocialButton}
        label="+ Добавить социальную сеть"
        type={BUTTON_TYPES.text}
        color={BUTTON_COLORS.orange}
      />
      {globalError && (
        <div className={styles.globalError}>{globalError}</div>
      )}
    </div>
  )
}

export default observer(CreateCompany)
