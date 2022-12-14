import React, { PureComponent } from 'react'
import classNames from 'classnames'

import Hint from '../Hint'

import styles from './index.module.css'

/**
 * Component for output label.
 */

class Label extends PureComponent {
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
      <div ref={innerRef} className={classNames(styles.root, className)}>
        <span className={styles.label}>
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
