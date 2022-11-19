import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import classNames from 'classnames'

import Input, { INPUT_TYPES } from '../../components/Input'
import Select, { SELECT_TYPES } from '../../components/Select'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES, BUTTON_TYPES } from '../../components/Button'
import { getApiPath, callGetApi, callPostApi } from '../../helpers/fetch'

import styles from './index.module.css'
import PasswordCheck from '../../components/PasswordCheck'
import Link from '../../components/Link'
import Checkbox from '../../components/Checkbox'


const formStoreName = 'registration'

const Registration = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { query: { token }, push } = useRouter()

  const { authData } = store

  const company = !!authData.id
  const verify = !!authData.login && !company
  const reg = !company && !verify


  const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

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

  const companies = store.callHttpQuery(custodianApiPath + 'company', {
    cacheTime: Number.MAX_SAFE_INTEGER,
    params: {
      only: ['name', 'ownership_type', 'ownership_type.name'],
    },
  })

  const companiesArray = companies.get('data.data') || []

  const globalError = form.get('errors.globalError')

  useEffect(() => {
    if (verify && token) {
      callGetApi(authApiPath + 'activate?token=' + token)
        .then(resp => {
          const realToken = resp.data.data.token
          callPostApi(authApiPath + 'verify-token/', { headers: { Authorization: `Token ${realToken}` } })
            .then(({ data: { data } }) => {
              store.setAuthData({
                ...data,
                token: realToken,
              })
              form.set('data', data)
            })
        })
        .catch(resp => {
          if (resp.status >= 400) {
            let error = resp.error
            while (error && typeof error === 'object') {
              error = error.error || error.data
            }
            store.createFormStore('error', {
              modalComponent: 'MessageBox',
              props: {
                width: 400,
                children: error,
              },
            })
          }
        })
    }
  }, [])

  return (
    <div className={styles.root}>
      <Head>
        <title>Горпром | Регистрация</title>
      </Head>
      <div className={styles.top}>
        <Link className={styles.goBackBtn} href={'/'} onClick={store.clearAuthData}>
          {'<'}
        </Link>
        {[
          { title: 'Регистрация', active: reg },
          { title: 'Верификация', active: verify },
          { title: 'Данные организации', active: company },
          // { title: 'Данные организации', active: verify },
        ].map(({ title, active }, i, arr) => (
          <div key={i} className={styles.step}>
            <div className={classNames(styles.stepText, active && styles.active)}>{title}</div>
            {(i !== arr.length - 1) && <div className={styles.stepArrow}>{'>'}</div>}
          </div>
        ))}
      </div>
      {company && (
        <>
          <div className={styles.mainRegistration}>
            <Input
              label="Должность"
              value={form.get('data.profile.position')}
              errors={form.get('errors.profile.position')}
              onChange={(value) => form.set('data.profile.position', value)}
              onInvalid={(value) => form.set('errors.profile.position', value)}
              onValid={() => form.set('errors.profile.position', [])}
            />
            <Select
              clearable
              type={SELECT_TYPES.filterDropdown}
              label="Организация"
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
            <Button
              className={styles.addCompany}
              type={BUTTON_TYPES.text}
              specialType={BUTTON_SPECIAL_TYPES.plus}
              color={BUTTON_COLORS.orange}
              label="Добавить организацию"
              link="/profile/organization/edit"
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
          </div>
          <div className={styles.controls}>
            <Button
              label="Завершить"
              disabled={form.hasErrors}
              onClick={() => {
                form.submit(authApiPath + 'account/' + form.get('data.id') + '/', 'PATCH')
                  .then(({ data }) => {
                    store.setAuthData(data?.data)
                    store.deleteFormStore(formStoreName)
                    push('/profile')
                  })
              }}
            />
            <Button
              type={BUTTON_TYPES.border}
              label="Пропустить"
              link="/profile"
            />
          </div>
          {globalError && (
            <div className={styles.globalError}>{globalError}</div>
          )}
        </>
      )}
      {verify && (
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
            onClick={() => {
              callPostApi(authApiPath + 'activate/',
                {
                  body: JSON.stringify({ login: authData.login }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                .then(() => {
                  store.createFormStore('success', {
                    modalComponent: 'MessageBox',
                    props: {
                      width: 400,
                      children: 'Письмо отправлено',
                    },
                  })
                })
            }}
          />
          <Link className={styles.supportLink} href={'/support'}>Написать в службу поддержки</Link>
        </div>
      )}
      {reg && (
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
      )}
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
