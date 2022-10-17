import { useEffect } from 'react'
import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../Icon'


const PasswordCheck = ({
  password = '',
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
      { title: `Как минимум ${minLength} символов`, icn: ICONS_TYPES.clear, style: styles.clear } :
      { title: `Как минимум ${minLength} символов`, icn: ICONS_TYPES.confirm, style: styles.check }

    errorsArr.push(lengthErr)
  }

  if (checkLower) {
    const lowerErr = /[a-z]/g.test(password) ?
      { title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.confirm, style: styles.check } :
      { title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.clear, style: styles.clear }

    errorsArr.push(lowerErr)
  }

  if (checkUpper) {
    const upperErr = /[A-Z]/g.test(password) ?
      { title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.confirm, style: styles.check } :
      { title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.clear, style: styles.clear }

    errorsArr.push(upperErr)
  }

  if (checkNumber) {
    const numErr = /[0-9]/g.test(password) ?
      { title: 'Числа (0-9)', icn: ICONS_TYPES.confirm, style: styles.check } :
      { title: 'Числа (0-9)', icn: ICONS_TYPES.clear, style: styles.clear }

    errorsArr.push(numErr)
  }

  if (checkSpec) {
    const specErr = /\W/g.test(password) ?
      { title: 'Без спец. символов', icn: ICONS_TYPES.clear, style: styles.clear } :
      { title: 'Без спец. символов', icn: ICONS_TYPES.confirm, style: styles.check }

    errorsArr.push(specErr)
  }

  if (checkLetter) {
    const letterErr = /[a-z]/gi.test(password) ?
      { title: 'Буквы (a-z)', icn: ICONS_TYPES.confirm, style: styles.check } :
      { title: 'Буквы (a-z)', icn: ICONS_TYPES.clear, style: styles.clear }

    errorsArr.push(letterErr)
  }

  const errors = errorsArr.filter((item) => { return item.icn === ICONS_TYPES.clear}).map((item) => item.title)

  useEffect(() => {
    onValidate(errors)
  }, [password])

  if (!password || !(minLength || checkLetter || checkUpper || checkLower || checkNumber || checkSpec)) {
    return null
  }

  const renderErrors = (arr) => {
    return arr.map(({ title, icn, style }, i) => {
      return (
        <div className={styles.item} key={i}>
          <Icon type={icn} size={11} className={style}/>
          {title}
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
