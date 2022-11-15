import classNames from 'classnames'
import Header from './Header'
import Footer from './Footer'

import styles from './index.module.css'


const Layout = ({
  children,
  layoutProps: {
    headerProps,
    footerProps,
    mainProps: {
      className,
    } = {},
    ...layoutProps
  } = {},
  ...props
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.root}>
        <Header {...props} {...headerProps} {...layoutProps} />
        <main className={classNames(className, styles.main)}>{children}</main>
        <Footer {...props} {...footerProps} {...layoutProps} />
      </div>
    </div>
  )
}

export default Layout
