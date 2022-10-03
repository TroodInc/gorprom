import { useEffect, useState } from 'react'
import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../Icon'

const PasswordCheck = ({
  password,
  minLength, // number, if set - check min length
  checkLetter, // bool, if set - check pass has letter
  checkUpper, // bool, if set - check pass has upper case letter
  checkLower, // bool, if set - check pass has lower case letter
  checkNumber, // bool, if set - check pass has number
  checkSpec, // bool, if set - check pass has special character
  onValidate, // function, callback
}) => {

  const errors = []

  if(minLength) {
    const lengthErr = password.length < minLength ? 
      {title: `Как мин. ${minLength} символов`, icn: ICONS_TYPES.clear, style: styles.clear} :
      {title: `Как мин. ${minLength} символов`, icn: ICONS_TYPES.confirm, style: styles.check} 

    errors.push(lengthErr)
  }

  if(checkLower) {
    const lowerErr = /[a-z]/g.test(password) ? 
      {title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.confirm, style: styles.check} :
      {title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.clear, style: styles.clear}

    errors.push(lowerErr);
  }

  if(checkUpper) {
    const upperErr = /[A-Z]/g.test(password) ? 
      {title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.confirm, style: styles.check} :
      {title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.clear, style: styles.clear}

    errors.push(upperErr);
  }

  if(checkNumber) {
    const numErr = /[0-9]/g.test(password) ?
      {title: 'Числа (0-9)', icn: ICONS_TYPES.confirm, style: styles.check} :
      {title: 'Числа (0-9)', icn: ICONS_TYPES.clear, style: styles.clear}
    
    errors.push(numErr);
  }

  if(checkSpec) {
    const specErr = /\W/g.test(password) ?
      {title: 'Без спец. символов', icn: ICONS_TYPES.clear, style: styles.clear} :
      {title: 'Без спец. символов', icn: ICONS_TYPES.confirm, style: styles.check}

    errors.push(specErr)
  }

  if(checkLetter) {
    const letterErr = /[a-z]/gi.test(password) ?
      {title: 'Буквы (a-z)', icn: ICONS_TYPES.confirm, style: styles.check} :
      {title: 'Буквы (a-z)', icn: ICONS_TYPES.clear, style: styles.clear}

    errors.push(letterErr)
  }
      
  useEffect(() => {
    // on password change - validate it and call callback with string array of errors
    onValidate(errors)
  }, [password])

  
  const renderErrors = (arr) => {
    return arr.map(({title, icn, style}, i) => {
      return (
        <div className={styles.item} key={i}>
          <Icon type={icn} size={10} className={style}/>
          {title}
        </div>
      )
    })
  }

  const elems = renderErrors(errors)

  // render errors
  return (
    <div className={styles.root}>
      <div className={styles.label}> Ваш пароль должен содержать:</div>
      <div className={styles.erorrs}>
      {elems}
      </div>
    </div>
  )
}

export default PasswordCheck
