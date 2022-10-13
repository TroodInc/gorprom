import Input from '../../components/Input'
import PasswordCheck from '../../components/PasswordCheck'
import Button from '../../components/Button'
import Modal from '../../components/Modal'


const Login = ({ form, ...props }) => (
  <Modal {...props}>
    <div>Создать аккаунт</div>
    <Input
      label="Логин"
      type="email"
      value={form.get('data.login')}
      errors={form.get('errors.login')}
      onChange={(value) => form.set('data.login', value)}
      onInvalid={(value) => form.set('errors.login', value)}
      onValid={() => form.set('errors.login', [])}
    />
    <Input
      label="Пароль"
      type="password"
      value={form.get('data.password')}
      errors={form.get('errors.password')}
      onChange={(value) => form.set('data.password', value)}
      onInvalid={(value) => form.set('errors.password', value)}
      onValid={() => form.set('errors.password', [])}
    />
    <PasswordCheck
      password={form.get('data.password')}
      checkLetter
      checkNumber
      minLength={8}
      onValidate={(value) => form.set('errors.passwordCheck', value)}
    />
    <Button
      label="Продолжить"
      disabled={form.hasErrors}
      onClick={() => form.submit('/login/', 'POST')}
    />
    <div>
      <div>Уже есть аккаунт?</div>
      <Button label="Войти" type="text" />
    </div>
  </Modal>
)

export default Login
