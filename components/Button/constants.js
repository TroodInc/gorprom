import { ICONS_TYPES } from '../Icon'


export const BUTTON_TYPES = {
  text: 'text',
  border: 'border',
  fill: 'fill',
}

export const SPECIAL_BUTTON_ARROW_LEFT = 'arrowLeft'
export const SPECIAL_BUTTON_ARROW_RIGHT = 'arrowRight'

export const BUTTON_SPECIAL_TYPES = {
  ...ICONS_TYPES,
  [SPECIAL_BUTTON_ARROW_LEFT]: SPECIAL_BUTTON_ARROW_LEFT,
  [SPECIAL_BUTTON_ARROW_RIGHT]: SPECIAL_BUTTON_ARROW_RIGHT,
}

export const BUTTON_COLORS = {
  red: 'red',
  blue: 'blue',
  white: 'white',
  gray: 'gray',
  orange: 'orange',
  green: 'green',
}
