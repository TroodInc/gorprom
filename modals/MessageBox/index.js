import Modal from '../../components/Modal'

import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../../components/Icon'


const Gallery = ({ children, onClose, width = 700, ...other }) => {
  return (
    <Modal type="center" className={styles.root} width={width} onClose={onClose} {...other}>
      <Icon size={20} type={ICONS_TYPES.clear} className={styles.button} onClick={onClose} />
      {children}
    </Modal>
  )
}

export default Gallery
