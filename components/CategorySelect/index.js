/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import { MobXProviderContext, observer } from 'mobx-react'

import Icon, { ICONS_TYPES } from '../Icon'
import Label from '../Label'

import styles from './index.module.css'


const CategorySelect = ({
  className,
  label,
  placeholder,
  hint,
  validate: {
    required,
    checkOnBlur = true,
  },
  endpoint,
  value,
  errors = [],
  showTextErrors = true,
  onChange,
  onInvalid,
  onValid,
}) => {
  const { store } = useContext(MobXProviderContext)
  const [blur, setBlur] = useState(false)

  const currentErrors = Array.isArray(errors) ? errors : [errors]

  useEffect(() => {
    if (required) {
      if (value) {
        onValid()
      } else {
        onInvalid(['Обязательное значение'])
      }
    }
  }, [value, required])

  let valueName

  if (value) {
    const productCategory = store.callHttpQuery(endpoint + '/' + value, {
      cacheTime: Number.MAX_SAFE_INTEGER,
      params: {
        only: 'name',
      },
    })
    valueName = productCategory.get('data.data.name')
  }

  const openModal = () => {
    store.createFormStore('modal', {
      modalComponent: 'CategoryModal',
      props: {
        endpoint,
        value,
        onChange: onChange,
      },
    })
    setBlur(true)
  }

  const showErrors = (!checkOnBlur || blur) && !!currentErrors?.length

  return (
    <div
      className={classNames(className, styles.root, showErrors && styles.error)}>
      {label && (
        <Label required={required} hint={hint}>
          {label}
        </Label>
      )}
      <div
        className={styles.control}
        onClick={openModal}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value ? valueName : placeholder}
        </span>
        <Icon
          size={16}
          type={ICONS_TYPES.triangleArrow}
          className={classNames(styles.icon)}
        />
      </div>
      {showTextErrors && showErrors && (
        <div className={styles.errors}>
          {currentErrors.map((error, index) => (
            <div className={styles.errorText} key={index}>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default observer(CategorySelect)
