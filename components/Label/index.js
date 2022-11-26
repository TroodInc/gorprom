import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import Hint from '../Hint'

import styles from './index.module.css'

/**
 * Component for output label.
 */

class Label extends PureComponent {
  static propTypes = {
    /** class name for styling component */
    className: PropTypes.string,
    /** show star * or not */
    required: PropTypes.bool,
    /** label text */
    label: PropTypes.node,
  }

  static defaultProps = {
    className: '',
    required: false,
  }

  render() {
    const {
      innerRef,
      className,
      required,
      hint,
      children: label,
    } = this.props

    return (
      <div ref={innerRef} className={styles.root}>
        <span className={classNames(styles.label, className)}>
          {label}
        </span>
        {required && (
          <span className={styles.required}>*</span>
        )}
        {hint && (
          <Hint className={styles.hint} message={hint} />
        )}
      </div>

    )
  }
}

export default Label
