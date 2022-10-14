import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'

import { IMAGE_FIT } from './constants'


const Image = (props) => {
  const {
    className,
    url,
    alt,
    fit,
    ...other
  } = props

  return (
    <div
      {...other}
      className={classNames(styles.root, className)}
    >
      <img src={url} alt={alt || url} style={{ objectFit: fit }} className={styles.image} />
    </div>
  )
}

Image.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string,
  fit: PropTypes.oneOf(Object.values(IMAGE_FIT)),
}

Image.defaultProps = {
  fit: IMAGE_FIT.fill,
}

export default Image

export { IMAGE_FIT }
