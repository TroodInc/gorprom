import { useState } from 'react'
import Image from 'next/image'

import Modal from '../../components/Modal'

import styles from './index.module.css'
import Icon, { ICONS_TYPES } from '../../components/Icon'


const Gallery = ({ items, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex)

  const link = items[index]
  const prevIndex = index - 1 >= 0 ? index - 1 : items.length - 1
  const nextIndex = index + 1 > items.length - 1 ? 0 : index + 1

  return (
    <Modal type="full" className={styles.root}>
      <Icon size={20} type={ICONS_TYPES.clear} className={styles.button} onClick={onClose} />
      <Icon size={50} type={ICONS_TYPES.arrowThin} className={styles.prev} onClick={() => setIndex(prevIndex)} />
      <Image
        alt={`Photo ${index + 1}`}
        src={link}
        width={760}
        height={540}
        objectFit="scale-down"
      />
      <Icon size={50} type={ICONS_TYPES.arrowThin} className={styles.next} onClick={() => setIndex(nextIndex)} />
    </Modal>
  )
}

export default Gallery
