import { useEffect } from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames'

import styles from './index.module.css'


ReactModal.setAppElement('#__next')

const Modal = ({
  className,
  overlayClassName,
  type = 'center',
  width = 400,
  height,
  style,
  children,
  onClose = () => {},
  afterClose,
  ...other
}) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => document.body.style.overflow = prevOverflow
  }, [])

  useEffect(() => () => {
    if (typeof afterClose === 'function') afterClose()
  }, [])

  return (
    <ReactModal
      {...other}
      id={undefined}
      onRequestClose={onClose}
      className={classNames(className, styles.modal, styles[type])}
      overlayClassName={classNames(overlayClassName, styles.overlay, styles[type])}
      style={{
        content: {
          width,
          height,
          ...style,
        },
      }}
      isOpen
      contentLabel="Minimal Modal Example"
    >
      {children}
    </ReactModal>
  )
}

export default Modal
