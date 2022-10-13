import ReactModal from 'react-modal'
import classNames from 'classnames'

import styles from './index.module.css'


ReactModal.setAppElement('#__next')

const Modal = ({
  className,
  type = 'center',
  width = 400,
  style,
  children,
  onClose = () => {},
  ...other
}) => (
  <ReactModal
    {...other}
    onRequestClose={onClose}
    className={classNames(className, styles.modal, styles[type])}
    overlayClassName={classNames(styles.overlay, styles[type])}
    style={{
      content: {
        width,
        ...style,
      },
    }}
    isOpen
    contentLabel="Minimal Modal Example"
  >
    {children}
  </ReactModal>
)

export default Modal
