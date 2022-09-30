import { useEffect } from 'react'
import styles from './index.module.css'


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
  useEffect(() => {
    // on password change - validate it and call callback with string array of errors
    // onValidate(errors)
  }, [password])

  // render errors
  return (
    <div className={styles.root}>
      PasswordCheck
    </div>
  )
}

export default PasswordCheck
