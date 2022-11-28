import Link from '../Link'
import classNames from 'classnames'
import styles from './index.module.css'
import Image from 'next/image'
import moment from 'moment'
import Icon, { ICONS_TYPES } from '../Icon'

const NewsCard = ({ big, data: { id, created, name, type, photo } = {} }) => {
  if (!id) return <div className={classNames(styles.newsItem, big ? styles.big : styles.normal)} />
  const link = type === 'NEWS' ?
    `/news/${id}` :
    `/events/${id}`
  if (big) {
    return (
      <Link className={classNames(styles.newsItem, styles.big)} href={link}>
        <Image
          alt={photo}
          src={photo}
          layout="fill"
          objectFit="cover"
        />
        <div className={styles.newsContent}>
          <h3 className={styles.title}>
            {name}
          </h3>
          <div className={styles.date}>
            {moment(created).format('DD.MM.YYYY HH.mm')}
          </div>
        </div>
      </Link>
    )
  }
  return (
    <Link className={classNames(styles.newsItem, styles.normal)} href={link}>
      <div className={styles.newsContent}>
        <h3 className={styles.title}>
          {name}
        </h3>
        <div className={styles.row}>
          <div className={styles.date}>
            {moment(created).format('DD.MM.YYYY HH.mm')}
          </div>
          <Icon
            type={ICONS_TYPES.arrowWithTail}
            className={styles.arrowWithTail}
            size={46}
          />
        </div>
        <div className={styles.imageWrapper}>
          <Image
            alt={photo}
            src={photo}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
