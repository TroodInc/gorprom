/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from 'react'
import classNames from 'classnames'
import { MobXProviderContext } from 'mobx-react'
import memoizeOne from 'memoize-one'

import Modal from '../../components/Modal'
import Icon, { ICONS_TYPES } from '../../components/Icon'
import Button, { BUTTON_TYPES } from '../../components/Button'

import styles from './index.module.css'


const getChilds = (dict, childs = []) => {
  if (!childs.length) return undefined
  return childs.reduce((memo, child) => {
    const childObj = dict[child]
    return {
      ...memo,
      [child]: {
        ...childObj,
        childs: getChilds(dict, childObj.childs),
      },
    }
  }, {})
}

const innerGetCategoryStruct = categoryArray => {
  const categoryDict = categoryArray.reduce((memo, item) => ({
    ...memo,
    [item.id]: item,
  }), {})

  const categoryTree = categoryArray
    .filter(item => item.parent === null)
    .reduce((memo, item) => ({
      ...memo,
      [item.id]: {
        ...item,
        childs: getChilds(categoryDict, item.childs),
      },
    }), {})

  return { categoryDict, categoryTree }
}

const getCategoryStruct = memoizeOne(innerGetCategoryStruct)

const innerGetValueArray = (dict, value) => {
  if (!value) return []
  const v = [value]
  let item = dict[value]
  while (item && item.parent) {
    v.unshift(item.parent)
    item = dict[item.parent]
  }

  return v
}

const getValueArray = memoizeOne(innerGetValueArray)

const CategoryModal = ({ endpoint, value, onClose, onChange, ...other }) => {
  const { store } = useContext(MobXProviderContext)
  const [currentValue, setCurrentValue] = useState(value)

  const category = store.callHttpQuery(endpoint, {
    cacheTime: Number.MAX_SAFE_INTEGER,
    params: {
      depth: 1,
    },
  })
  const categoryArray = category.get('data.data') || []
  const categoryArrayLoaded = category.loaded

  const { categoryDict, categoryTree } = getCategoryStruct(categoryArray)

  const currentValueArray = categoryArrayLoaded ? getValueArray(categoryDict, currentValue) : []

  const rightTree = currentValueArray.length < 2 ? undefined :
    categoryTree[currentValueArray[0]].childs[currentValueArray[1]].childs

  const currentCategory = categoryDict[currentValue]

  const canSaveValue = !!currentCategory && !(currentCategory.childs && currentCategory.childs.length)

  return (
    <Modal width={864} type="center" className={styles.root} {...other}>
      <Icon size={15} type={ICONS_TYPES.clear} className={styles.button} onClick={onClose} />
      <div className={styles.title}>Выберите процесс</div>
      <div className={styles.main}>
        <div className={styles.left}>
          {Object.values(categoryTree).map(({ id, name, childs = {} }) => {
            const isActive = currentValueArray.includes(id)
            const childsArray = Object.values(childs)
            const isClickable = !childsArray.length
            return (
              <div key={id} className={styles.categoryBlock}>
                <div
                  className={classNames(
                    styles.mainCategory,
                    { [styles.clickable]: isClickable },
                    { [styles.active]: isActive },
                  )}
                  onClick={isClickable ? () => setCurrentValue(id) : undefined}
                >
                  {name}
                  {isActive && isClickable && (
                    <Icon
                      type={ICONS_TYPES.confirm}
                      size={15}
                    />
                  )}
                </div>
                {childsArray.map(item => {
                  const isActive = currentValueArray.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={classNames(styles.subCategory, styles.clickable, { [styles.active]: isActive })}
                      onClick={() => setCurrentValue(item.id)}
                    >
                      {item.name}
                      {isActive && (
                        <Icon
                          type={ICONS_TYPES.confirm}
                          size={12}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className={styles.right}>
          {rightTree && Object.values(rightTree).map(({ id, name, childs = {} }) => {
            const isActive = currentValueArray.includes(id)
            const childsArray = Object.values(childs)
            const isClickable = !childsArray.length
            return (
              <div key={id} className={styles.categoryBlock}>
                <div
                  className={classNames(
                    styles.addCategory,
                    { [styles.clickable]: isClickable },
                    { [styles.active]: isActive },
                  )}
                  onClick={isClickable ? () => setCurrentValue(id) : undefined}
                >
                  {name}
                  {isActive && isClickable && (
                    <Icon
                      type={ICONS_TYPES.confirm}
                      size={15}
                    />
                  )}
                </div>
                {childsArray.map(item => {
                  const isActive = currentValueArray.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={classNames(styles.subAddCategory, styles.clickable, { [styles.active]: isActive })}
                      onClick={() => setCurrentValue(item.id)}
                    >
                      {item.name}
                      {isActive && (
                        <Icon
                          type={ICONS_TYPES.confirm}
                          size={12}
                        />
                      )}
                    </div>
                  )}
                )}
              </div>
            )}
          )}
        </div>
      </div>
      <Button
        disabled={!canSaveValue}
        type={BUTTON_TYPES.fill}
        label="Применить"
        onClick={() => {
          onChange(currentValue)
          onClose()
        }}
      />
    </Modal>
  )
}

export default CategoryModal
