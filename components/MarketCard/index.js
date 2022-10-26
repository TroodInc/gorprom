import Image from 'next/image'
import classNames from 'classnames'

import Button from '../Button'

import styles from './index.module.css'


const TypeNameDict = {
  'PRODUCT': 'Товар',
  'SERVICE': 'Услуга',
  'COMPANY': 'Компания',
}

const TypeImgDict = {
  'PRODUCT': '/image/product.png',
  'SERVICE': '/image/service.png',
  'COMPANY': '/image/company.png',
}

const MarketCard = ({ className, data = {}, type = 'PRODUCT', showType }) => {
  let image = type === 'COMPANY' ? data.logo : (data.photo_set || [])[0]?.link
  if (!image) image = TypeImgDict[type]

  return (
    <div className={classNames(styles.root, className, styles[type.toLowerCase()])}>
      <div className={styles.left}>
        <Image
          alt={data.name}
          src={image}
          width={190}
          height={110}
          objectFit="cover"
        />
      </div>
      <div className={styles.center}>
        <div className={styles.title}>
          {data.name}
        </div>
        {type === 'COMPANY' && (
          <div className={styles.description}>
            {data.description}
          </div>
        )}
        <div className={styles.footer}>
          {type !== 'COMPANY' && (
            <div className={styles.companyName}>
              {data.company?.name}
            </div>
          )}
          {showType && (
            <div className={styles.type}>
              Категория: {TypeNameDict[type].toLowerCase()}
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div />
        <Button className={styles.button} label="Связаться" />
      </div>
    </div>
  )
}

export default MarketCard
