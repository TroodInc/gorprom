import Modal from '../../components/Modal'

import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../../components/Icon'


const Gallery = ({ children, onClose, ...other }) => {
  return (
    <Modal type="center" className={styles.root} {...other}>
      <Icon size={72} type={ICONS_TYPES.close} className={styles.button} onClick={onClose} />
      {children}
    </Modal>
  )
}

export default Gallery
