import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

import Input, { INPUT_TYPES } from '../../components/Input'
import Button, { BUTTON_COLORS, BUTTON_TYPES } from '../../components/Button'
import { getApiPath } from '../../helpers/fetch'

import styles from './index.module.css'
import PasswordCheck from '../../components/PasswordCheck'


const formStoreName = 'recovery'

const Recovery = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { query: { token } } = useRouter()
  const [send, setSend] = useState(false)
  const [changed, setChanged] = useState(false)

  if (send) {
    return (
      <div className={styles.root}>
        <Head>
          <title>Горпром | Восстановление пароля</title>
        </Head>
        <div className={styles.message}>
          Ссылка для восстановления пароля отправлена на вашу почту.
        </div>
      </div>
    )
  }

  if (changed) {
    return (
      <div className={styles.root}>
        <Head>
          <title>Горпром | Восстановление пароля</title>
        </Head>
        <div className={styles.message}>
          Новый пароль успешно установлен.
        </div>
        <div className={styles.message}>
          Теперь вы можете войти на сайт используя новый пароль.
        </div>
        <Button
          label="Войти"
          color={BUTTON_COLORS.orange}
          link="/login"
        />
      </div>
    )
  }

  const formStore = store.createFormStore(formStoreName, {
    form: {
      data: { token },
    },
  })
  const { form } = formStore

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)

  const globalError = form.get('errors.globalError')

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Восстановление пароля</title>
      </Head>
      {!token && (
        <Input
          className={styles.login}
          label="Почта"
          type={INPUT_TYPES.email}
          value={form.get('data.login')}
          errors={form.get('errors.login')}
          validate={{ required: true, checkOnBlur: true }}
          onChange={(value) => form.set('data.login', value)}
          onInvalid={(value) => form.set('errors.login', value)}
          onValid={() => form.set('errors.login', [])}
        />
      )}
      {token && (
        <>
          <Input
            className={styles.password}
            label="Пароль"
            type={INPUT_TYPES.password}
            value={form.get('data.password')}
            errors={form.get('errors.password')}
            validate={{ required: true, checkOnBlur: true }}
            onChange={(value) => form.set('data.password', value)}
            onInvalid={(value) => form.set('errors.password', value)}
            onValid={() => form.set('errors.password', [])}
          />
          <Input
            className={styles.password}
            label="Подтвердите пароль"
            type={INPUT_TYPES.password}
            value={form.get('data.password_confirmation')}
            errors={form.get('errors.password_confirmation')}
            validate={{ required: true, checkOnBlur: true }}
            onChange={(value) => form.set('data.password_confirmation', value)}
            onInvalid={(value) => form.set('errors.password_confirmation', value)}
            onValid={() => form.set('errors.password_confirmation', [])}
          />
          <PasswordCheck
            password={form.get('data.password')}
            confirmation={form.get('data.password_confirmation')}
            minLength={8}
            checkLower
            checkUpper
            checkNumber
            onValidate={(value) => form.set('errors.passwordCheck', value)}
          />
        </>
      )}
      <Button
        className={styles.forgotButton}
        label="Вспомнили пароль?"
        type={BUTTON_TYPES.text}
        color={BUTTON_COLORS.orange}
        link="/login"
      />
      <Button
        className={styles.loginButton}
        label="Продолжить"
        disabled={form.hasErrors}
        onClick={() => {
          form.submit(authApiPath + 'password-recovery/', token ? 'PATCH' : 'POST')
            .then(({ data }) => {
              if (token) {
                setChanged(true)
                store.deleteFormStore(formStoreName)
              } else {
                setSend(true)
                store.deleteFormStore(formStoreName)
              }
            })
        }}
      />
      {globalError && (
        <div className={styles.globalError}>{globalError}</div>
      )}
    </div>
  )
}

Recovery.layoutProps = {
  authPage: true,
}

Recovery.getInitialProps = async({ ctx, router }, { account }) => {
  if (account?.id) {
    const redirect = '/profile'
    if (!process.browser) {
      ctx.res.writeHead(302, {
        Location: redirect,
        'Content-Type': 'text/html; charset=utf-8',
      })
      ctx.res.end()
    } else {
      if (window.location.pathname === redirect) {
        router.reload()
      } else {
        router.replace(redirect)
      }
    }
  }
  return {}
}

export default observer(Recovery)
