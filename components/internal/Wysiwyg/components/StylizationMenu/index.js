import React from 'react'
import classNames from 'classnames'

import StyleButton from '../StyleButton'
import StyleColorPicker from '../StyleColorPicker'

import style from './index.module.css'


const StylizationMenu = ({
  className,
  inlineStyles = [],
  textColorStyles = [],
  backgroundColorStyles = [],
  editorState = {},
  onToggle = () => {},
}) => {
  return (
    <div className={classNames(style.root, className)}>
      {inlineStyles.map(type => (
        <StyleButton
          {...type}
          editorState={editorState}
          onToggle={onToggle}
          key={type.style}
        />
      ))}
      {!!textColorStyles.length &&
        <StyleColorPicker {...{
          placeholder: 'Text color',
          colorStyles: textColorStyles,
          editorState,
          onToggle,
        }} />
      }
      {!!backgroundColorStyles.length &&
        <StyleColorPicker {...{
          placeholder: 'Background color',
          colorStyles: backgroundColorStyles,
          editorState,
          onToggle,
        }} />
      }
    </div>
  )
}

export default StylizationMenu
