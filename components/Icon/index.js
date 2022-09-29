import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

import {
  ICONS_TYPES,
  ICON_COMPS,
  LABEL_POSITION_TYPES,
  ROTATE_TYPES,
  ROTATE_VALUES,
} from './constants'

import CustomSvg from './customSvg'

import style from './index.module.css'


/**
 * Component for output icon.
 */

const Icon = ({
  innerRef,
  size,
  color,
  type,
  className,
  rotate,
  label,
  labelPosition,
  disabled,
  onClick,
  dataAttributes,

  ...other
}) => {

  const inlineStyle = {
    transform: `rotate(${typeof rotate === 'string' ? ROTATE_VALUES[rotate] : rotate}deg)`,
    width: size,
    height: size,
  }

  return (
    <div {...{
      ...dataAttributes,
      ref: innerRef,
      className: classNames(
        style.root,
        className,
        labelPosition === LABEL_POSITION_TYPES.down || labelPosition === LABEL_POSITION_TYPES.up ?
          style['root-column'] : '',
      ),
      'data-cy': type,
      onClick: disabled ? undefined : onClick,
      style: {
        cursor: onClick && 'pointer',
        color,
      },
    }} >
      <div {...{
        className: style.svgWrapper,
        style: inlineStyle,
      }} >
        {!(!type && !other.svgNodes) && React.createElement(other.svgNodes ? CustomSvg : ICON_COMPS[type], other)}
      </div>
      {label && (
        <div {...{
          className: style[labelPosition],
        }}>
          {label}
        </div>
      )}
    </div>
  )
}

Icon.propTypes = {
  /** class name for styling component */
  className: PropTypes.string,
  /** width and height size icon in px */
  size: PropTypes.number,
  /** all types you can see below in example */
  type: PropTypes.oneOf(Object.keys(ICONS_TYPES)),
  /** viewBox size for customSvg */
  svgViewBox: PropTypes.arrayOf(PropTypes.number),
  /** components for customSvg */
  svgNodes: PropTypes.object,
  /** default type for rotate you can see in constants, or send number in deg */
  rotate: PropTypes.oneOfType([
    PropTypes.oneOf(Object.values(ROTATE_TYPES)),
    PropTypes.number,
  ]),
  /** label icon */
  label: PropTypes.node,
  /** label position is one of LABEL_POSITION_TYPES.up, LABEL_POSITION_TYPES.down,
   * LABEL_POSITION_TYPES.left, LABEL_POSITION_TYPES.right */
  labelPosition: PropTypes.oneOf(Object.keys(LABEL_POSITION_TYPES)),
  /** color icon */
  color: PropTypes.string,
  /** disabled or not */
  disabled: PropTypes.bool,
  /** onClick function */
  onClick: PropTypes.func,
}

Icon.defaultProps = {
  className: '',
  rotate: ROTATE_TYPES.up,
  labelPosition: LABEL_POSITION_TYPES.right,
  disabled: false,
}

export { ICONS_TYPES, ROTATE_TYPES, LABEL_POSITION_TYPES } from './constants'

export default Icon
