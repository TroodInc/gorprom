import { useEffect } from 'react'
import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../Icon'


const PasswordCheck = ({
  password = '',
  confirmation,
  minLength,
  checkLetter,
  checkUpper,
  checkLower,
  checkNumber,
  checkSpec,
  onValidate = () => {},
}) => {
  const errorsArr = []

  if (minLength) {
    const lengthErr = password.length < minLength ?
      {
        title: `Как минимум ${minLength} символов`,
        icn: ICONS_TYPES.clear,
        iconStyle: styles.clear,
      }
      :
      {
        title: `Как минимум ${minLength} символов`,
        icn: ICONS_TYPES.confirm,
        iconStyle: styles.check,
      }

    errorsArr.push(lengthErr)
  }

  if (checkLower) {
    const lowerErr = /[a-z]/g.test(password) ?
      { title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.confirm, iconStyle: styles.check } :
      { title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.clear, iconStyle: styles.clear }

    errorsArr.push(lowerErr)
  }

  if (checkUpper) {
    const upperErr = /[A-Z]/g.test(password) ?
      { title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.confirm, iconStyle: styles.check } :
      { title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.clear, iconStyle: styles.clear }

    errorsArr.push(upperErr)
  }

  if (checkNumber) {
    const numErr = /[0-9]/g.test(password) ?
      { title: 'Числа (0-9)', icn: ICONS_TYPES.confirm, iconStyle: styles.check } :
      { title: 'Числа (0-9)', icn: ICONS_TYPES.clear, iconStyle: styles.clear }

    errorsArr.push(numErr)
  }

  if (checkSpec) {
    const specErr = /\W/g.test(password) ?
      { title: 'Без спец. символов', icn: ICONS_TYPES.clear, iconStyle: styles.clear } :
      { title: 'Без спец. символов', icn: ICONS_TYPES.confirm, iconStyle: styles.check }

    errorsArr.push(specErr)
  }

  if (checkLetter) {
    const letterErr = /[a-z]/gi.test(password) ?
      { title: 'Буквы (a-z)', icn: ICONS_TYPES.confirm, iconStyle: styles.check } :
      { title: 'Буквы (a-z)', icn: ICONS_TYPES.clear, iconStyle: styles.clear }

    errorsArr.push(letterErr)
  }

  if (confirmation) {
    const confirmationErr = confirmation === password ?
      { title: 'Пароли совпадают', icn: ICONS_TYPES.confirm, iconStyle: styles.check } :
      { title: 'Пароли не совпадают', icn: ICONS_TYPES.clear, iconStyle: styles.clear }

    errorsArr.push(confirmationErr)
  }

  const errors = errorsArr.filter((item) => item.icn === ICONS_TYPES.clear).map((item) => item.title)

  useEffect(() => {
    onValidate(errors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmation])

  if (!password ||
    !(minLength || checkLetter || checkUpper || checkLower || checkNumber || checkSpec || confirmation)) {
    return null
  }

  const renderErrors = (arr) => {
    return arr.map(({ title, icn, iconStyle }, i) => {
      return (
        <div className={styles.item} key={i}>
          <Icon type={icn} size={16} className={iconStyle}/>
          <div>
            {title}
          </div>
        </div>
      )
    })
  }

  const elems = renderErrors(errorsArr)

  // render errors
  return (
    <div className={styles.root}>
      <div className={styles.label}> Ваш пароль должен содержать:</div>
      <div className={styles.errors}>
        {elems}
      </div>
    </div>
  )
}

export default PasswordCheck
