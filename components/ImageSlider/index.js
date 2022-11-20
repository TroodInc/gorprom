import { useEffect, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'

import styles from './index.module.css'


let timer

const changeImage = (length, index, setIndex) => () => {
  let nextIndex = index + 1
  if (nextIndex >= length) {
    nextIndex = 0
  }
  setIndex(nextIndex)
}

const ImageSlider = ({ className, items = [], duration = 10, children }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => () => {
    if (timer) clearTimeout(timer)
  }, [])
  useEffect(() => {
    timer = setTimeout(changeImage(items.length, index, setIndex), duration * 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length])

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item, i) => (
        <div
          key={item}
          className={classNames(styles.imageWrapper, i !== index && styles.hidden)}
          style={{ animationDuration: `${duration / 10}s` }}
        >
          <Image src={item} alt="image" layout="fill" objectFit="cover" objectPosition="top" />
        </div>
      ))}
      <div className={styles.menu}>
        {items.map((item, i) => (
          <div
            key={item}
            className={classNames(styles.button, i === index && styles.active)}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

export default ImageSlider
