import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import deepEqual from 'deep-equal'

import styles from './index.module.css'

import {
  LIST_TYPES,
  LIST_ORIENTATION,
  SCROLL_THRESHOLD,
} from './constants'

import { selectValue } from '../../constants'

import Checkbox, { CHECK_VIEW_TYPES } from '../../../Checkbox'
import LoadingIndicator from '../../../LoadingIndicator'

import TileListItem from '../TileListItem'
import TextListItem from '../TextListItem'


const Toggle = props => <Checkbox {...props} viewType={CHECK_VIEW_TYPES.toggle}/>

const getItemComponent = (type) => {
  switch (type) {
    case LIST_TYPES.checkbox:
      return Checkbox
    case LIST_TYPES.toggle:
      return (props) => Toggle
    case LIST_TYPES.tile:
      return TileListItem
    default:
      return TextListItem
  }
}

const valueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

class List extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    itemClassName: PropTypes.string,

    type: PropTypes.oneOf(Object.values(LIST_TYPES)),
    orientation: PropTypes.oneOf(Object.values(LIST_ORIENTATION)),
    multi: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: valueTypes,
      label: PropTypes.node,
    })),
    values: PropTypes.arrayOf(valueTypes),
    clearable: PropTypes.bool,
    isLoading: PropTypes.bool,
    emptyItemsLabel: PropTypes.node,

    maxRows: PropTypes.number,
    autoScroll: PropTypes.bool,
    disabled: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onScrollToEnd: PropTypes.func,
  }

  static defaultProps = {
    type: LIST_TYPES.text,
    orientation: LIST_ORIENTATION.vertical,
    items: [],
    values: [],

    autoScroll: true,

    onChange: () => {},
    onBlur: () => {},
    onScrollToEnd: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.calcMaxHeight = this.calcMaxHeight.bind(this)
    this.scrollToItem = this.scrollToItem.bind(this)
    this.scrollToFirstSelected = this.scrollToFirstSelected.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    this.calcMaxHeight()
    this.scrollToFirstSelected()
    if (this.list) this.list.addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate(prevProps) {
    this.calcMaxHeight()
    if (!deepEqual(prevProps.items, this.props.items)) {
      this.scrollToEndFired = false
    }
    if (this.props.show && !prevProps.show) {
      this.scrollToFirstSelected()
    }
    if (this.props.focusedItem !== undefined && this.props.focusedItem !== prevProps.focusedItem) {
      const item = this.props.items[this.props.focusedItem]
      this.scrollToItem(item, true)
    }
  }

  calcMaxHeight() {
    const { maxRows } = this.props
    if (maxRows && this.list) {
      const maxHeight = this.list.firstChild.offsetHeight * maxRows
      if (!Number.isNaN(maxHeight)) this.setState({ maxHeight })
    }
  }

  scrollToItem(item, force) {
    const element = this[`option${item.value}`]
    setTimeout(() => {
      if (element && this.list) {
        let newScrollPositions = element.offsetTop + element.offsetHeight - this.list.offsetHeight
        if (force) {
          newScrollPositions = newScrollPositions < 0 ? 0 : newScrollPositions
        } else {
          newScrollPositions = newScrollPositions < this.list.scrollTop ? this.list.scrollTop : newScrollPositions
        }
        this.list.scrollTop = newScrollPositions
      }
    }, 0)
  }

  scrollToFirstSelected() {
    const {
      maxRows,
      autoScroll,
      items,
      values,
    } = this.props
    if (autoScroll && maxRows && values.length && this.list) {
      const firstSelected = items.find(item => values.some(v => v === item.value)) || {}
      this.scrollToItem(firstSelected)
    }
  }

  handleScroll() {
    if (this.list) {
      const scrollFromBottom = this.list.scrollHeight - this.list.scrollTop - this.list.clientHeight
      if (!this.scrollToEndFired && scrollFromBottom < SCROLL_THRESHOLD) {
        this.props.onScrollToEnd()
        this.scrollToEndFired = true
      }
    }
  }

  handleSelect(value) {
    const { onBlur } = this.props
    selectValue(value, this.props)
    onBlur()
  }

  render() {
    const {
      className,
      itemClassName,
      type,
      orientation,
      items,
      values,
      emptyItemsLabel = 'Пусто',
      disabled,
      isLoading,
      focusedItem,
    } = this.props

    const { maxHeight } = this.state

    const ItemComponent = getItemComponent(type)

    const isSelected = item => values.some(el => el === item.value)

    return (
      <ul {...{
        className: classNames(styles.root, styles[orientation], className),
        ref: (node) => {
          this.list = node
        },
        style: { maxHeight },
      }}>
        {items.map((item, i) => (
          <li
            className={classNames(
              type === LIST_TYPES.tile ? styles.tileItemWrapper : styles.itemWrapper,
              (i === focusedItem || isSelected(item)) && styles.itemHover)}
            key={item.value || `${item.value}`}
            ref={(node) => {
              this[`option${item.value}`] = node
            }}
          >
            <ItemComponent {...{
              className: classNames(
                type === LIST_TYPES.tile ? styles.tileItem : styles.item,
                itemClassName,
              ),
              value: isSelected(item),
              label: item.label || item.value,
              disabled,
              onChange: () => this.handleSelect(item.value),
            }} />
          </li>
        ))}
        {
          !items.length && emptyItemsLabel &&
          <li className={styles.empty}>
            {emptyItemsLabel}
          </li>
        }
        {
          isLoading &&
          <li className={classNames(styles.itemWrapper, styles.loader)}>
            <LoadingIndicator {...{
              size: 20,
            }} />
          </li>
        }
      </ul>
    )
  }
}

export { LIST_TYPES, LIST_ORIENTATION } from './constants'

export default List
