import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import classNames from 'classnames'

import Input, { INPUT_TYPES } from '../../components/Input'
import Button, { BUTTON_COLORS, BUTTON_TYPES } from '../../components/Button'
import { getApiPath } from '../../helpers/fetch'

import styles from './index.module.css'
import PasswordCheck from '../../components/PasswordCheck'


const formStoreName = 'registration'

const Registration = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()

  const formStore = store.createFormStore(formStoreName)
  const { form } = formStore

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)

  const globalError = form.get('errors.globalError')

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Регистрация</title>
      </Head>
      <div className={styles.left}>
        {[
          { title: 'Регистрация', active: true },
          { title: 'Верификация', active: false },
        ].map(({ title, active }, i) => (
          <div key={i} className={classNames(styles.step, active && styles.active)}>
            {i + 1}. {title}
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <Input
          className={styles.login}
          label="Почта"
          type={INPUT_TYPES.email}
          value={form.get('data.login')}
          errors={form.get('errors.login')}
          validate={{ required: true }}
          onChange={(value) => form.set('data.login', value)}
          onInvalid={(value) => form.set('errors.login', value)}
          onValid={() => form.set('errors.login', [])}
        />
        <Input
          className={styles.password}
          label="Пароль"
          type={INPUT_TYPES.password}
          value={form.get('data.password')}
          errors={form.get('errors.password')}
          validate={{ required: true }}
          onChange={(value) => form.set('data.password', value)}
          onInvalid={(value) => form.set('errors.password', value)}
          onValid={() => form.set('errors.password', [])}
        />
        <PasswordCheck
          password={form.get('data.password')}
          minLength={8}
          checkLower
          checkUpper
          checkNumber
          onValidate={(value) => form.set('errors.passwordCheck', value)}
        />
        <Button
          className={styles.loginButton}
          label="Продолжить"
          disabled={form.hasErrors}
          onClick={() => {
            form.submit(authApiPath + 'register/', 'POST')
              .then(({ data }) => {
                store.setAuthData(data?.data)
                router.push('/')
                store.deleteFormStore(formStoreName)
              })
          }}
        />
        {globalError && (
          <div className={styles.globalError}>{globalError}</div>
        )}
        <div className={styles.registerQuestion}>Уже есть аккаунт?</div>
        <Button
          className={styles.registerButton}
          label="Войти"
          type={BUTTON_TYPES.text}
          color={BUTTON_COLORS.orange}
          link="/login"
        />
      </div>
    </div>
  )
}

export default observer(Registration)