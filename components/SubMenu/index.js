import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.css'
import Link from '../Link'

const SubMenu = ({ arr }) => {
  return (
    <div className={styles.root}>
      {arr.map(({ link, title }, index) => (
        <Link href={link} key={link} className={styles.link}>
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
  arr: PropTypes.arrayOf(PropTypes.object),
}

export default SubMenu
