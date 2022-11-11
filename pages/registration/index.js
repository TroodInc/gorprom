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
import Link from '../../components/Link'
import Checkbox from '../../components/Checkbox'


const formStoreName = 'registration'

const Registration = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()

  const { authData } = store

  const formStore = store.createFormStore(
    formStoreName,
    {
      form: {
        data: {
          profile: {
            role: 'USER',
          },
        },
      },
    },
  )
  const { form } = formStore

  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)

  const globalError = form.get('errors.globalError')

  const verify = authData.id

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Регистрация</title>
      </Head>
      <div className={styles.top}>
        <Link className={styles.goBackBtn} href={'/registration'}>
          {'<'}
        </Link>
        {[
          { title: 'Регистрация', active: !verify },
          { title: 'Верификация', active: verify },
          // { title: 'Данные организации', active: verify },
        ].map(({ title, active }, i, arr) => (
          <div key={i} className={styles.step}>
            <div className={classNames(styles.stepText, active && styles.active)}>{title}</div>
            {(i !== arr.length - 1) && <div className={styles.stepArrow}>{'>'}</div>}
          </div>
        ))}
      </div>
      {verify &&
        <div className={styles.mainVerification}>
          <div className={styles.verificationText}>
            Пожалуйста, проверьте электронную почту – мы отправили ссылку для завершения регистрации.
          </div>
          <div className={styles.verificationQuestion}>Не получили письмо?</div>
          <Button
            className={styles.verificationButton}
            label="Отправить повторно"
            type={BUTTON_TYPES.fill}
            color={BUTTON_COLORS.black}
            onClick={() => console.warn('Предупреждающее сообщение')}
          />
          <Link className={styles.supportLink} href={'/support'}>Написать в службу поддержки</Link>
        </div>
      }
      {!verify &&
        <div className={styles.mainRegistration}>
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
            className={styles.login}
            label="Электронная почта"
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
          <PasswordCheck
            password={form.get('data.password')}
            minLength={8}
            checkLower
            checkUpper
            checkNumber
            onValidate={(value) => form.set('errors.passwordCheck', value)}
          />
          <div className={styles.checkboxWrapper}>
            <Checkbox
              className={styles.checkbox}
              value={form.get('data.profile.agreement')}
              errors={form.get('errors.profile.agreement')}
              validate={{ required: true, checkOnBlur: true }}
              onChange={(value) => form.set('data.profile.agreement', value)}
              onInvalid={(value) => form.set('errors.profile.agreement', value)}
              onValid={() => form.set('errors.profile.agreement', [])}
            />
            <div className={styles.checkboxText}>
              Регистрируясь, я соглашаюсь на обработку&nbsp;
              <Link
                className={styles.checkboxLink}
                href={'/personal'}
                target={'_blank'}
              >
                Персональных данных
              </Link>
            </div>
          </div>
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
      }
    </div>
  )
}

Registration.layoutProps = {
  authPage: true,
}

Registration.getInitialProps = async({ ctx, router }, { account }) => {
  if (account?.active) {
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

export default observer(Registration)
