import { ICONS_TYPES } from '../../Icon'


const BOLD_STYLE = 'bold'
const ITALIC_STYLE = 'italic'
const UNDERLINE_STYLE = 'underline'
const TEXT_COLOR_STYLE = 'textColor'
const BACKGROUND_COLOR_STYLE = 'backgroundColor'

export const DEFAULT_STYLES = {
  [BOLD_STYLE]: BOLD_STYLE,
  [ITALIC_STYLE]: ITALIC_STYLE,
  [UNDERLINE_STYLE]: UNDERLINE_STYLE,
  [TEXT_COLOR_STYLE]: TEXT_COLOR_STYLE,
  [BACKGROUND_COLOR_STYLE]: BACKGROUND_COLOR_STYLE,
}

export const DEFAULT_COLORS = [
  'black',
  'white',
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'aqua',
  'purple',
]

export const DEFAULT_STYLES_SCHEMA = {
  [BOLD_STYLE]: {
    style: 'BOLD',
    icon: ICONS_TYPES.bold,
  },
  [ITALIC_STYLE]: {
    style: 'ITALIC',
    icon: ICONS_TYPES.italic,
  },
  [UNDERLINE_STYLE]: {
    style: 'UNDERLINE',
    icon: ICONS_TYPES.underline,
  },
}

export const getColorStylesSchema = (colors, bg) => colors.map(color => ({
  style: `${bg ? 'bg' : ''}color-${color}`,
  color,
  icon: ICONS_TYPES.square,
}))

export const getColorStylesMap = (colors, bg) => colors.reduce((memo, curr) => ({
  ...memo,
  [`${bg ? 'bg' : ''}color-${curr}`]: {
    [bg ? 'background' : 'color']: curr,
  },
}), {})
