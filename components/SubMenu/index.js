import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'
import Link from '../Link'

const SubMenu = ({ items, className }) => {
  return (
    <div className={classNames(className, styles.root)}>
      {items.map(({ link, title, ...other }) => (
        <Link href={link} key={link} className={styles.link} activeClassName={styles.active} {...other}>
          <div className={styles.title}>
            {title}
          </div>
          <div className={styles.border} />
        </Link>
      ))}
    </div>
  )
}

SubMenu.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
}

export default SubMenu
