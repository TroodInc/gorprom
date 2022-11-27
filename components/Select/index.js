import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import deepEqual from 'deep-equal'

import { ICONS_TYPES } from '../Icon'
import Label from '../Label'

import { SELECT_TYPES } from './constants'

import List, { LIST_ORIENTATION, LIST_TYPES } from './components/List'
import DropDown from './components/DropDown'
import Tile from './components/Tile'
import Rating from './components/Rating'

import styles from './index.module.css'


const valueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

/**
 * Component for select some value.
 */

class TSelect extends PureComponent {
  static propTypes = {
    /** class name for styling component */
    className: PropTypes.string,
    /** class name for styling label */
    labelClassName: PropTypes.string,
    /** type is one of SELECT_TYPES.dropdown, SELECT_TYPES.filterDropdown, SELECT_TYPES.tile,
     * SELECT_TYPES.list, SELECT_TYPES.rating */
    type: PropTypes.oneOf(Object.values(SELECT_TYPES)),
    /** list type is one of LIST_TYPES.text, LIST_TYPES.filterDropdown, LIST_TYPES.radio, LIST_TYPES.checkbox,
     * LIST_TYPES.toggle, LIST_TYPES.tile */
    listType: PropTypes.oneOf(Object.values(LIST_TYPES)),
    /** multi select or not */
    multi: PropTypes.bool,
    /** label text */
    label: PropTypes.node,
    /** select values */
    values: PropTypes.arrayOf(valueTypes),
    /** clearable or not */
    clearable: PropTypes.bool,
    /** disabled or not */
    disabled: PropTypes.bool,
    /** list errors */
    errors: PropTypes.arrayOf(PropTypes.string),
    /** validate settings */
    validate: PropTypes.shape({
      /** check on blur or not */
      checkOnBlur: PropTypes.bool,
      /** required or not */
      required: PropTypes.bool,
    }),
    /** show text errors or not */
    showTextErrors: PropTypes.bool,
    /** onValid function */
    onValid: PropTypes.func,
    /** onInvalid function */
    onInvalid: PropTypes.func,

    /** class name for control. For select with type "DropDown" */
    controlClassName: PropTypes.string,
    /** class name for value. For select with type "DropDown" */
    valueClassName: PropTypes.string,
    /** Open options to up when true. For select with type "DropDown" */
    openUp: PropTypes.bool,
    /** style for main select container. For select with type "DropDown" */
    mainSelectContainerStyle: PropTypes.object,
    /** items data. For select with type "DropDown" and "List" or "Tile" */
    items: PropTypes.arrayOf(PropTypes.shape({
      /** item value */
      value: valueTypes,
      /** item label */
      label: PropTypes.node,
    })),
    /** control. For select with type "DropDown" */
    iconProps: PropTypes.object,
    /** placeholder text. For select with type "DropDown" or "Tile" */
    placeholder: PropTypes.node,
    /** show search control. For select with type "DropDown" */
    showSearch: PropTypes.bool,
    /** set when loading finish. For select with type "DropDown" and "List" */
    isLoading: PropTypes.bool,
    /** default open selector or not. For select with type "DropDown" and "List" or "Tile" */
    defaultOpen: PropTypes.bool,
    /** maximum number of rows. For select with type "DropDown" and "List" */
    maxRows: PropTypes.number,
    /** autoScroll or not. For select with type "DropDown" and "List" */
    autoScroll: PropTypes.bool,
    /** onChange function. For select with type "DropDown" and "List" or "Tile" or "Rating" */
    onChange: PropTypes.func,
    /** onBlur function. For select with type "DropDown" and "List" or "Tile" or "Rating" */
    onBlur: PropTypes.func,
    /** onFocus function. For select with type "DropDown" or "Rating" */
    onFocus: PropTypes.func,
    /** onSearch function. For select with type "DropDown" */
    onSearch: PropTypes.func,
    /** onAdd function. For select with type "DropDown" */
    onAdd: PropTypes.func,
    /** missing value resolver. For select with type "DropDown" or "Tile" */
    missingValueResolver: PropTypes.func,
    /** children node. For select with type "DropDown" */
    children: PropTypes.node,

    /** class name for item. For select with type "List" */
    itemClassName: PropTypes.string,
    /** orientation is one of LIST_ORIENTATION.vertical, LIST_ORIENTATION.horizontal.
     * For select with type "List" or "Tile" */
    orientation: PropTypes.oneOf(Object.values(LIST_ORIENTATION)),
    /** children node. For select with type "List" */
    emptyItemsLabel: PropTypes.node,
    /** children node. For select with type "List" */
    onScrollToEnd: PropTypes.func,

    /** rating value. For select with type "Rating" */
    value: PropTypes.number,
    /** max rating value. For select with type "Rating" */
    maxRating: PropTypes.number,
    /** icon settings. For select with type "Rating" */
    icon: PropTypes.shape({
      /** all types you can see in component TIcon */
      type: PropTypes.oneOf(Object.values(ICONS_TYPES)),
      /** width and height size icon in px */
      size: PropTypes.number,
      /** class name for styling component */
      className: PropTypes.string,
      /** class name for active icon */
      activeIconClassName: PropTypes.string,
      /** class name for in active icon */
      inActiveIconClassName: PropTypes.string,
    }),
  }

  static defaultProps = {
    type: SELECT_TYPES.dropdown,
    values: [],

    errors: [],
    validate: {},
    showTextErrors: true,

    onValid: () => {},
    onInvalid: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      wasBlured: false,
      wasFocused: false,
    }

    this.lastValid = true

    this.handleValidate = this.handleValidate.bind(this)
    this.toggleBlur = this.toggleBlur.bind(this)
    this.toggleFocus = this.toggleFocus.bind(this)
    this.getSelectComponent = this.getSelectComponent.bind(this)
  }

  componentDidMount() {
    this.handleValidate(this.props.values)
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(prevProps.values, this.props.values) || !deepEqual(prevProps.validate, this.props.validate)) {
      this.handleValidate(this.props.values)
    }
  }

  componentWillUnmount() {
    if (!this.lastValid) {
      this.lastValid = true
      this.props.onValid()
    }
  }

  getSelectComponent(errors) {
    const {
      type,
      multi,
      clearable,
      listType,
    } = this.props

    const generalProps = {
      ...this.props,
      className: undefined,
      type: listType,
      clearable: clearable === undefined ? multi : clearable,
      errors,
      onBlur: () => {
        this.toggleBlur()
        this.toggleFocus(false)
      },
      onFocus: () => {
        this.toggleFocus(true)
        this.toggleBlur(false)
      },
    }

    switch (type) {
      case SELECT_TYPES.filterDropdown:
        return (
          <DropDown {...{
            ...generalProps,
            showSearch: true,
          }} />
        )
      case SELECT_TYPES.tile:
        return (
          <Tile {...{
            ...generalProps,
          }} />
        )
      case SELECT_TYPES.rating:
        return (
          <Rating {...{
            ...generalProps,
          }} />
        )
      case SELECT_TYPES.list:
        return (
          <List {...{
            ...generalProps,
          }} />
        )
      default:
        return (
          <DropDown {...{
            ...generalProps,
          }} />
        )
    }
  }

  handleValidate(values) {
    const {
      validate: {
        required,
      },
      errors,
      disabled,
      onValid,
      onInvalid,
    } = this.props

    if (!disabled) {
      const newErrors = required && !values.length ?
        ['Обязательное значение'] : []

      if (newErrors.length) {
        this.lastValid = false
        if (!deepEqual(errors, newErrors)) onInvalid(newErrors)
      } else
      if (!this.lastValid) {
        this.lastValid = true
        onValid()
      }
    }
  }

  toggleBlur(wasBlured = true) {
    this.setState({ wasBlured: wasBlured })
  }

  toggleFocus(wasFocused) {
    this.setState({ wasFocused: wasFocused })
  }

  render() {
    const {
      className,
      labelClassName,
      label,
      hint,

      errors,
      validate: {
        checkOnBlur,
        required,
      },
      showTextErrors,
    } = this.props

    const currentErrors = checkOnBlur && !this.state.wasBlured ? [] : errors
    const hasErrors = !!currentErrors.length

    return (
      <div className={classNames(className, styles.root)}>
        {
          !!label &&
            <Label
              className={classNames(labelClassName, { [styles.active]: this.state.wasFocused })}
              required={required}
              hint={hint}
            >
              {label}
            </Label>
        }
        {this.getSelectComponent(currentErrors)}
        {
          showTextErrors && hasErrors &&
          <div className={styles.errors}>
            {currentErrors.map((error, index) => (
              <div className={styles.errorText} key={index}>
                {error}
              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}

export { SELECT_TYPES } from './constants'
export { LIST_ORIENTATION, LIST_TYPES } from './components/List'

export default TSelect
