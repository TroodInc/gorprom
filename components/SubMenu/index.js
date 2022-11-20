import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'
import Link from '../Link'
import Icon, { ICONS_TYPES, LABEL_POSITION_TYPES } from '../Icon'
import HiddenContent from '../HiddenContent'
import { useRouter } from 'next/router'
import escapeRegExp from 'lodash/escapeRegExp'

const SubMenu = ({ items, className }) => {
  const { asPath } = useRouter()

  return (
    <div className={classNames(className, styles.root)}>
      {items.map(({ link, title, subItems, ...other }) => {
        if (subItems?.length) {
          const active = (new RegExp(`^${escapeRegExp(link)}`)).test(asPath)
          return (
            <HiddenContent
              key={link}
              ControlComponent={({ open }) => (
                <Icon
                  size={16}
                  type={ICONS_TYPES.triangleArrow}
                  className={classNames(styles.link, (open || active) && styles.active)}
                  label={title}
                  labelPosition={LABEL_POSITION_TYPES.left}
                  rotate={open ? 180 : 0}
                />
              )}
            >
              <div className={styles.subMenu}>
                {subItems.map(subItem => {
                  return (
                    <Link
                      key={subItem.link}
                      href={link + subItem.link}
                      className={styles.link}
                      activeClassName={styles.active}
                      exact={subItem.exact}
                    >
                      {subItem.title}
                    </Link>
                  )
                })}
              </div>
            </HiddenContent>
          )
        }
        return (
          <Link href={link} key={link} className={styles.link} activeClassName={styles.active} {...other}>
            {title}
          </Link>
        )
      })}
    </div>
  )
}

SubMenu.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
}

export default SubMenu
