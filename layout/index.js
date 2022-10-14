import Header from './Header'
import Footer from './Footer'

import styles from './index.module.css'


const Layout = ({ children, ...props }) => {
  return (
    <div className={styles.root}>
      <Header {...props} />
      <main className={styles.main}>{children}</main>
      <Footer {...props} />
    </div>
  )
}

export default Layout
