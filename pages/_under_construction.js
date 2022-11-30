import styles from '../styles/error.module.css'
import Image from 'next/image'
import Head from 'next/head'


const UnderConstruction = () => (
  <div className={styles.root}>
    <Head>
      <title>Сайт в процессе разработки</title>
    </Head>
    <div className={styles.logo}>
      <Image
        alt="Горпром"
        src={'/image/logoDark.svg'}
        width={624}
        height={100}
      />
    </div>
    <div className={styles.underConstruction}>
      <div className={styles.top} />
      <div className={styles.center}>
        <div className={styles.text}>На сайте проводятся работы</div>
        <div className={styles.text}>Скоро вернемся</div>
      </div>
      <div className={styles.bottom} />
    </div>
  </div>
)

export default UnderConstruction
