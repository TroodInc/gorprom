import Head from 'next/head'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import PasswordCheck from '../components/PasswordCheck'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'
import { useState } from 'react'

import styles from './index.module.css'

export default function Home() {
  const [val, setVal] = useState('')
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Modal control={<Button label="Open Modal" />}>
        <div className={styles.modalTitle}>Создать аккаунт</div>
        <Input label="Логин" type="mail" />
        <Input label="Пароль" type="password"  onChange={() => setVal(document.querySelector('Input[type="password"]').value)}/>
        <PasswordCheck password={val} minLength={8} checkLower checkUpper checkNumber  onValidate={(arr) => {return arr}}/>
        <Button label="Продолжить" />
        <div className={styles.modalFooter}>
          <div>Уже есть аккаунт?</div>
          <Button label="Войти" type="text" />
        </div>
      </Modal>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const rules = await getRules()
  const context = getAbacContext(ctx)
  const pageAllow = getPageAllow({ context, rules, path: context.ctx.path })

  return {
    props: {
      pageAllow,
    },
  }
}
