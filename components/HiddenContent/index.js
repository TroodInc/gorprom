import React, { PureComponent } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './index.module.css'
import { POSITION_TYPES } from './constants'
import ClickOutside from '../internal/ClickOutside'

class HiddenContent extends PureComponent {
  static propTypes = {
    control: PropTypes.node,
    children: PropTypes.node,
    position: PropTypes.oneOf(Object.values(POSITION_TYPES)),
  }

  static defaultProps = {
    position: POSITION_TYPES.bottomLeft,
  }

  constructor(props) {
    super(props)
    this.state = { isVisible: false }
    this.toggleContent = this.toggleContent.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  toggleContent() {
    this.setState((state) => {
      return { isVisible: !state.isVisible }
    })
  }

  handleOutsideClick() {
    this.setState({ isVisible: false })
  }

  render() {
    const {
      className,
      ControlComponent,
      children,
      position,
    } = this.props

    const {
      isVisible,
    } = this.state

    return (
      <ClickOutside onClick={this.handleOutsideClick}>
        <div className={classNames(styles.root, className)}>
          <div onClick={this.toggleContent}>
            {<ControlComponent open={isVisible} />}
          </div>
          {isVisible &&
              <div className={styles[position]}>
                {children}
              </div>}
        </div>
      </ClickOutside>
    )
  }
}

export default HiddenContent
