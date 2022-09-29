import { snakeToCamel, camelToLowerSnake } from '../../helpers/namingNotation'
const context = require.context('./components', true, /\.js$/)


export const ICON_COMPS = context.keys().reduce((memo, key) => ({
  ...memo,
  [snakeToCamel(camelToLowerSnake(key.replace(/\.\/|\.js/g, '')))]: context(key).default,
}), {})

export const ICONS_TYPES = {}
Object.keys(ICON_COMPS).forEach(item => { ICONS_TYPES[item] = item })

const UP = 'up'
const RIGHT = 'right'
const DOWN = 'down'
const LEFT = 'left'

export const LABEL_POSITION_TYPES = {
  [RIGHT]: RIGHT,
  [LEFT]: LEFT,
  [UP]: UP,
  [DOWN]: DOWN,
}

export const ROTATE_TYPES = {
  [UP]: UP,
  [RIGHT]: RIGHT,
  [DOWN]: DOWN,
  [LEFT]: LEFT,
}

export const ROTATE_VALUES = {
  [UP]: 0,
  [RIGHT]: 90,
  [DOWN]: 180,
  [LEFT]: 270,
}
