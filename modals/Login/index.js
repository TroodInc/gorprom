import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'

import Modal from '../../components/Modal'
import Input, { INPUT_TYPES } from '../../components/Input'
import Button from '../../components/Button'

import styles from '../../styles/modal.module.css'


const Login = ({ form, ...props }) => {
  const { store } = useContext(MobXProviderContext)

  return (
    <Modal {...props} className={styles.root}>
      <div className={styles.title}>ГОРПРОМ</div>
      <Input
        label="Логин"
        type={INPUT_TYPES.email}
        value={form.get('data.login')}
        errors={form.get('errors.login')}
        validate={{ required: true }}
        onChange={(value) => form.set('data.login', value)}
        onInvalid={(value) => form.set('errors.login', value)}
        onValid={() => form.set('errors.login', [])}
      />
      <Input
        label="Пароль"
        type={INPUT_TYPES.password}
        value={form.get('data.password')}
        errors={form.get('errors.password')}
        validate={{ required: true }}
        onChange={(value) => form.set('data.password', value)}
        onInvalid={(value) => form.set('errors.password', value)}
        onValid={() => form.set('errors.password', [])}
      />
      <Button label="Забыли пароль?" type="text" />
      <Button
        label="Продолжить"
        disabled={form.hasErrors}
        onClick={() => {
          form.submit(process.env.NEXT_PUBLIC_AUTH_API + 'login/', 'POST')
            .then(({ data }) => {
              store.setAuthData(data?.data)
            })
        }}
      />
      <div className={styles.footer}>
        <div>Еще нет аккаунта?</div>
        <Button
          label="Регистрация"
          type="text"
          onClick={() => {
            store.createFormStore('registration', {
              modalComponent: 'Registration',
            })
            props.onClose()
          }}
        />
      </div>
    </Modal>
  )
}

export default Login
