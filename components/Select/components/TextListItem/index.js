import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'


const TextListItem = ({
  className,
  value,
  label,
  disabled,
  onChange,
}) => {
  return (
    <div
      {...{
        onClick: disabled ? undefined : () => onChange(),
        className: classNames(styles.root, className, value && styles.selected, disabled && styles.disabled),
      }}>
      {label}
    </div>
  )
}

export default TextListItem
