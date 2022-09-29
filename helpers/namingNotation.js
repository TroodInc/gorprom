import sortBy from 'lodash/sortBy'

import { isPureObject } from './def'


export const camelToHuman = s => s.replace(/([a-z])([A-Z]+)/g, '$1 $2').toLowerCase()
export const camelToUpperHuman = s => s.charAt(0).toUpperCase() + s.replace(/([a-z])([A-Z]+)/g, '$1 $2').substring(1)
const camelToSnake = (s = '') => s.replace(/([a-z])([A-Z]+)/g, '$1_$2')
export const camelToLowerSnake = s => camelToSnake(s).toLowerCase()
export const camelToUpperSnake = s => camelToSnake(s).toUpperCase()
// Using camel to snake for exclude camelCase parts from converting to lower case
export const snakeToCamel = s => {
  return camelToLowerSnake(s)
    .replace(/(\B)_+(.)/g, (match, g1, g2) => g1 + g2.toUpperCase())
}

const objectToCase = convertingFunc => (obj, config = {}) => {
  const {
    removeNulls = false,
    orderArrays = false,
  } = config
  if (!isPureObject(obj)) {
    return obj === null && removeNulls ? undefined : obj
  }

  if (Array.isArray(obj)) {
    let convertingArray = obj
    if (orderArrays) {
      convertingArray = sortBy(convertingArray, (item) => {
        if (typeof item === 'object') return item.order
        return ''
      })
    }
    return convertingArray.map(item => objectToCase(convertingFunc)(item, config))
  }
  return Object.keys(obj || []).reduce((memo, key) => {
    const currentObj = obj[key]
    const currentKey = convertingFunc(key)
    return {
      ...memo,
      [currentKey]: objectToCase(convertingFunc)(currentObj, config),
    }
  }, {})
}

export const objectToCamel = objectToCase(snakeToCamel)
export const objectToLowerSnake = objectToCase(camelToLowerSnake)
export const objectToUpperSnake = objectToCase(camelToUpperSnake)

export const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1)
export const lowerize = word => word.charAt(0).toLowerCase() + word.slice(1)
