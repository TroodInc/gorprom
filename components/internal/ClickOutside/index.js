/* eslint-disable react/no-find-dom-node */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { bind, unbind, getComposedPath } from '../../../helpers/events'

const clickEvents = ['click', 'touchend']

/**
 * Component wrapper, gives onClick event.
 */

class ClickOutside extends PureComponent {
  static propTypes = {
    /** onClick function */
    onClick: PropTypes.func,
    /** children node */
    children: PropTypes.node,
  }

  static defaultProps = {
    onClick: () => {},
  }

  constructor(props) {
    super(props)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount() {
    bind(clickEvents, this.handleOutsideClick)
  }

  componentWillUnmount() {
    unbind(clickEvents, this.handleOutsideClick)
  }

  handleOutsideClick(e) {
    const path = getComposedPath(e)
    if (!path.includes(this.ref)) {
      this.props.onClick()
    }
  }

  render() {
    const childElement = React.Children.only(this.props.children)
    if (!childElement) return null

    return React.cloneElement(
      childElement,
      {
        ref: el => {
          this.ref = el
          if (childElement.props?.innerRef) childElement.props?.innerRef(el)
          if (childElement.ref) childElement.ref(el)
        },
      },
    )
  }
}

export default ClickOutside
