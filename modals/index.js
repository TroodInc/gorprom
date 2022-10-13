import { observer } from 'mobx-react'

const context = require.context('./', true, /\.js$/)

export const modalsComponents = context.keys().reduce((memo, key) => {
  const modalName = (key.match(/\.\/(.*)\/index.js/) || [])[1]
  if (modalName) {
    return {
      ...memo,
      [modalName]: observer(context(key).default),
    }
  }
  return memo
}, {})

