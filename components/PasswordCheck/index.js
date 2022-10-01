import { useEffect, useCallback, useState } from 'react'
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
  minLength = password.length
  checkLetter = /[a-z]/gi.test(password)
  checkUpper = /[A-Z]/g.test(password)
  checkLower = /[a-z]/g.test(password)
  checkNumber = /[0-9]/g.test(password)
  checkSpec = /\W/g.test(password)

  const errors = []
  const [errorsArr, setErrorsArr] = useState([])

  onValidate = useCallback(
    (arr) => {
      const lengthErr = minLength < 8 ? 
      {title: 'Как мин. 8 символов', icn: ICONS_TYPES.clear, style: styles.clear} :
      {title: 'Как мин. 8 символов', icn: ICONS_TYPES.confirm, style: styles.check}
      arr.push(lengthErr);


      const lowerErr = (checkLower === false || checkLetter === false) ? 
        {title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.clear, style: styles.clear} :
        {title: 'Маленькие буквы (a-z)', icn: ICONS_TYPES.confirm, style: styles.check}
      arr.push(lowerErr)

      const upperErr = checkUpper === false  ? 
        {title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.clear, style: styles.clear} :
        {title: 'Заглавные буквы (A-Z)', icn: ICONS_TYPES.confirm, style: styles.check}
      arr.push(upperErr)


      const numErr = checkNumber === false ? 
        {title: 'Числа (0-9)', icn: ICONS_TYPES.clear, style: styles.clear} :
        {title: 'Числа (0-9)', icn: ICONS_TYPES.confirm, style: styles.check}
      arr.push(numErr)

      
    }, [errors])


  useEffect(() => {
    // on password change - validate it and call callback with string array of errors
    onValidate(errors)
    const returnErrs = () => setErrorsArr([...errors])
    returnErrs()
  }, [password, errorsArr])

  
  const renderErrors = (arr) => {
    return arr.map(({title, icn, style}) => {
      return (
        <div className={styles.item}>
          <Icon type={icn} size={10} className={style}/>
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
      <div className={styles.erorrs}>
      {elems}
      </div>
    </div>
  )
}

export default PasswordCheck
