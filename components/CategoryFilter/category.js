import classNames from 'classnames'

import Icon, { ICONS_TYPES } from '../Icon'

import styles from './index.module.css'
import React from 'react'


const Category = ({
  id,
  name,
  childs = [],
  parent,
  open,
  categoryDict = {},
  values = [],
  onChange,
}) => {
  const isOpen = open || values.includes(id)
  const isActive = !!values.length && values.indexOf(id) === values.length - 1
  const haveChilds = childs && !!childs.length
  const haveParent = !!parent
  return (
    <div className={classNames(styles.category, isOpen && styles.open)}>
      <div
        className={classNames(
          styles.title,
          id && styles.clickable,
          isActive && styles.active,
        )}
        onClick={id ? () => onChange(id) : undefined}
      >
        <span>{name}</span>
        {isActive && (
          <Icon {...{
            type: ICONS_TYPES.confirm,
            size: 8,
          }} />
        )}
        {haveChilds && haveParent && (
          <Icon {...{
            className: styles.arrow,
            type: ICONS_TYPES.triangleArrow,
            size: 10,
            rotate: isOpen ? 180 : 0,
          }} />
        )}
      </div>
      {childs.map((key, i) => {
        const item = typeof key === 'number' ? categoryDict[key] : key
        return (
          <Category
            key={key || i}
            {...item}
            categoryDict={categoryDict}
            values={values}
            onChange={onChange} />
        )
      })}
    </div>
  )
}

export default Category
