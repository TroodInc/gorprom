import { useEffect } from 'react'
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
  const passed = []

  if(minLength) {
    password.length < minLength ? 
      errors.push(`Как мин. ${minLength} символов`) :
      passed.push(`Как мин. ${minLength} символов`)
  }

  if(checkLower) {
    /[a-z]/g.test(password) ? 
      passed.push('Маленькие буквы (a-z)') :
      errors.push('Маленькие буквы (a-z)')
  }

  if(checkUpper) {
     /[A-Z]/g.test(password) ? 
      passed.push('Заглавные буквы (A-Z)') :
      errors.push('Заглавные буквы (A-Z)')
  }

  if(checkNumber) {
    /[0-9]/g.test(password) ?
      passed.push('Числа (0-9)') :
      errors.push('Числа (0-9)')
  }

  if(checkSpec) {
    /\W/g.test(password) ?
      errors.push('Без спец. символов') :
      passed.push('Без спец. символов')
   
  }

  if(checkLetter) {
    /[a-z]/gi.test(password) ?
      passed.push('Буквы (a-z)') :
      errors.push('Буквы (a-z)')
  
  }
      
  useEffect(() => {
    // on password change - validate it and call callback with string array of errors
    onValidate(errors)
  }, [password])

  
  const renderErrors = (arr) => {
    return arr.map((item, i) => {
      return (
        <div className={styles.item} key={i}>
          <Icon type={ICONS_TYPES.clear} size={10} className={styles.clear}/>
          {item}
        </div>
      )
    })
  }

  const renderPassed = (arr) => {
    return arr.map((item, i) => {
      return (
        <div className={styles.item} key={i}>
          <Icon type={ICONS_TYPES.confirm} size={10} className={styles.check}/>
          {item}
        </div>
      )
    })
  }

  const errs = renderErrors(errors)
  const pass = renderPassed(passed)

  // render errors
  return (
    <div className={styles.root}>
      <div className={styles.label}> Ваш пароль должен содержать:</div>
      <div className={styles.erorrs}> 
      {errs}
      {pass}
      </div>
    </div>
  )
}

export default PasswordCheck
