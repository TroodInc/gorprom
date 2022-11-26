import styles from './index.module.css'

import React from 'react'
import classNames from 'classnames'
import Icon, { ICONS_TYPES } from '../Icon'

const CategorySelect = ({
  label,
  placeholder,
  values,
  items,
  store,
  onChange,
}) => {

  function openModal() {
    store.createFormStore('modal', {
      modalComponent: 'CategoryModal',
      props: {
        width: 864,
        items: items,
        values: values,
        onChange: onChange,
      },
    })
  }

  function getValueName(id) {
    return items.find((item) => id === item.id)?.name
  }

  return (
    <div
      className={classNames(styles.root)}>
      {
        !!label &&
          <div className={classNames(styles.label)}>
            {label}
          </div>
      }
      <div
        className={styles.control}
        onClick={openModal}
      >
        <span className={classNames(styles.placeholder, { [styles.value]: values.length })}>
          {values.length ? getValueName(values[0]) : placeholder}
        </span>
        <Icon
          size={16}
          type={ICONS_TYPES.triangleArrow}
          className={classNames(styles.icon)}
        />
      </div>
    </div>
  )
}

export default CategorySelect
