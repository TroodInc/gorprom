import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.css'
import { POSITION_TYPES } from './constants'
import ClickOutside from '../internal/ClickOutside'

class HiddenContent extends PureComponent {
  static propTypes = {
    control: PropTypes.node,
    children: PropTypes.node,
    childrenPos: PropTypes.oneOf(Object.values(POSITION_TYPES)),
  }

  static defaultProps = {

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
      control,
      children,
      childrenPos,
    } = this.props

    const {
      isVisible,
    } = this.state

    return (
      <ClickOutside onClick={this.handleOutsideClick}>
        <div className={styles.root}>
          <div onClick={this.toggleContent}>
            {control}
          </div>
          {isVisible &&
              <div className={styles[childrenPos]}>
                {children}
              </div>}
        </div>
      </ClickOutside>
    )
  }
}

export default HiddenContent
