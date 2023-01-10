import memoizeOne from 'memoize-one'
import classNames from 'classnames'

import Category from './category'

import styles from './index.module.css'


const innerGetCategoryDict = categoryArray =>
  categoryArray.reduce((memo, item) => ({ ...memo, [item.id]: item }), {})

const getCategoryDict = memoizeOne(innerGetCategoryDict)

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

const CategoryFilter = ({ className, items = [], value, onChange }) => {
  const categoryDict = getCategoryDict(items)
  const values = getValueArray(categoryDict, value)
  return (
    <div className={classNames(className, styles.root)}>
      {items.filter(item => !item.parent).map((item, i) => (
        <Category
          key={item.id || i}
          {...item}
          categoryDict={categoryDict}
          values={values}
          open={true}
          onChange={v => onChange(v === value ? undefined : v)}
        />
      ))}
    </div>
  )
}

export default CategoryFilter
