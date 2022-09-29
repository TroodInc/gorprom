import { allCountries, iso2Lookup, allCountryCodes } from 'country-telephone-data'
import memoizeOne from 'memoize-one'


const dimRegexp = /\B(?=(\d{3})+(?!\d))/g

export const toNumber = (value, trim) => {
  const strValue = (value !== undefined && value !== null ? value.toString() : '')
  const isNegative = strValue.indexOf('-') === 0
  let parts = strValue.replace(/[^\d\u002c\u002e]/g, '').split(/\u002c|\u002e/)
  parts[0] = `${isNegative ? '-' : ''}${parts[0].replace(dimRegexp, ' ')}`
  parts[1] = parts.slice(1, parts.length).join('')
  if (parts[1] && trim !== undefined) parts[1] = parts[1].slice(0, trim)
  parts = parts.slice(0, 2).filter(p => p.length)
  return parts.join(',')
}

export const fromNumber = (value, trim) => {
  const strValue = (value !== undefined && value !== null ? value.toString() : '')
  const isNegative = strValue.indexOf('-') === 0
  let parts = strValue.replace(/[^\d\u002c\u002e]/g, '').split(/\u002c|\u002e/)
  parts[0] = `${isNegative ? '-' : ''}${parts[0]}`
  parts[1] = parts.slice(1, parts.length).join('')
  if (parts[1] && trim !== undefined) parts[1] = parts[1].slice(0, trim)
  parts = parts.slice(0, 2).filter(p => p.length)
  return parts.join('.')
}

const billion = 1000000
export const prettyNumber = (number, round, trimDim) => {
  let wasRounded = false
  let roundedValue = number
  if (round && number >= billion) {
    roundedValue = Math.round(roundedValue / billion * 10) / 10
    wasRounded = true
  }
  let result = toNumber(roundedValue.toString())
  if (wasRounded && !trimDim) {
    result += ' mln'
  }
  return result
}

const timeFormat = '..:..'
const timeRangeFormat = `${timeFormat}-${timeFormat}`
const noDots = /[^\u002e]/g

const noDigitsRegexp = /[^\d]/g

const toFormat = (format) => (value = '') => {
  return format.split('').reduce((memo, char) => {
    if (memo.remainingText.length === 0) {
      return memo
    }
    if (char !== '.') {
      return {
        formattedText: memo.formattedText + char,
        remainingText: memo.remainingText,
      }
    }

    return {
      formattedText: memo.formattedText + memo.remainingText[0],
      remainingText: memo.remainingText.slice(1, memo.remainingText.length),
    }
  }, {
    formattedText: '',
    remainingText: value.replace(noDigitsRegexp, ''),
  }).formattedText
}

const fromFormat = (replacementRegex, len, fromEnd) => (value = '') => {
  const formatted = value.toString().replace(replacementRegex, '')
  if (fromEnd) return formatted.slice(-len)
  return formatted.slice(0, len)
}

const getPhoneFormat = (value = '', ext = true) => {
  let countries = []
  for (let i = value.length; i > 0; i -= 1) {
    const subValue = value.substr(0, i)
    countries = (allCountryCodes[subValue] || []).map(countryCode => {
      const countryIndex = iso2Lookup[countryCode]
      return allCountries[countryIndex]
    }).sort((a, b) => a.order - b.order)
    countries = countries.filter(c => c.format)
    if (countries.length) break
  }
  if (countries.length) {
    const countryFormat = (countries[0].format || '').replace(/^\+/, '')
    if (!countryFormat) return undefined
    if (!ext) return countryFormat
    return `${countryFormat} ex ${Array(15).fill('.').join('')}`
  }
  return undefined
}

const memoizedGetPhoneFormat = memoizeOne(getPhoneFormat)

const maxPhoneCodeLength = Object.keys(allCountryCodes).reduce((memo, code) => {
  const codeLength = code.toString().length
  return codeLength > memo ? codeLength : memo
}, 0)

const minPhoneLength = allCountries.reduce((memo, country) => {
  const { length } = fromFormat(noDots)(country.format || '')
  if (length > 0 && length < memo) return length
  return memo
}, Infinity)

export const getPhoneFormatLength = (value = '') => {
  let length = minPhoneLength
  const format = memoizedGetPhoneFormat(value.substr(0, maxPhoneCodeLength), false)
  if (format) length = fromFormat(noDots)(format).length
  return length
}

/**
 * @func toPhone
 * @description Format string to phone
 * @param {String} value
 * @return {String} String in phone format
 */
export const toPhone = value => {
  const digitValue = fromFormat(noDigitsRegexp)(value)
  const phoneFormat = memoizedGetPhoneFormat(digitValue.substr(0, maxPhoneCodeLength))
  if (!phoneFormat) return digitValue
  return toFormat(phoneFormat)(digitValue)
}

/**
 * @func fromPhone
 * @description Unformat string from phone
 * @param {String} value
 * @param {Integer} maxLength
 * @return {String}
 */
export const fromPhone = (value, maxLength) => {
  const digitValue = fromFormat(noDigitsRegexp)(value)
  if (maxLength < 0) return digitValue
  const length = getPhoneFormatLength(digitValue)
  return fromFormat(noDigitsRegexp, maxLength || length)(value)
}

export const toTime = toFormat(timeFormat)
export const fromTime = fromFormat(noDigitsRegexp, 4, true)

export const toTimeRange = toFormat(timeRangeFormat)
export const fromTimeRange = fromFormat(noDigitsRegexp, 8)

export const humanizeNumber = (number, once, twice, many, zero) => {
  if (number === 0 && zero !== undefined) return zero
  const rest100 = number % 100
  const rest10 = number % 10
  if (rest100 > 10 && rest100 < 15) return `${number} ${many}`
  if (rest10 === 1) return `${number} ${once}`
  if (rest10 > 1 && rest10 < 5) return `${number} ${twice}`
  return `${number} ${many}`
}

export const formatSize = (length) => {
  const type = ['byte', 'Kb', 'Mb', 'Gb', 'Tb']
  let i = 0
  let newLength = length
  while (newLength && Math.round(newLength / 1024) > 0 && i < type.length - 1) {
    newLength /= 1024
    i += 1
  }
  return `${Math.round(newLength)} ${type[i]}`
}

export const toMoney = value => {
  const postfixArray = ['', 'M', 'B', 'T']

  const money = +value
  if (Math.round(money / 1000) < 1000) return { value: money, postfix: '' }
  let i = 0
  let formatValue = money
  let postfixValue = postfixArray[i]
  while (Math.round(formatValue) >= 1000) {
    postfixValue = postfixArray[i]
    formatValue = Math.round(formatValue / 100) / 10
    i += 1
    if (i + 1 > postfixArray.length) break
  }

  return { value: formatValue, postfix: postfixValue }
}

export const getTagsFromHtml = (html = '') => {
  const allTagsString = html.match(/<([a-z0-9]+)[^>]*>/gi) || []
  const allTags = []
  allTagsString.forEach(item => {
    const tag = item.match(/<([a-z0-9]+)[^>]*>/i)[1]
    if (tag && !allTags.includes(tag)) allTags.push(tag)
  })
  return allTags
}

export const html2text = (html = '') => html.replace(/<(?:.|\n)*?>/gm, ' ').replace(/\s+/gm, ' ')
