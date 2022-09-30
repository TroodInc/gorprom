import { useState } from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames'

import styles from './index.module.css'


const Modal = ({
  className,
  type = 'center',
  width = 400,
  style,
  control,
  children,
  ...other
}) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <div onClick={() => setShow(true)}>{control}</div>
      <ReactModal
        {...other}
        onRequestClose={() => setShow(false)}
        className={classNames(className, styles.modal, styles[type])}
        overlayClassName={classNames(styles.overlay, styles[type])}
        style={{
          content: {
            width,
            ...style,
          }
        }}
        isOpen={show}
        contentLabel="Minimal Modal Example"
      >
        {children}
      </ReactModal>
    </>
  )
}

export default Modal
