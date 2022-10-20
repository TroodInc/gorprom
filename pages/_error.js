import styles from '../styles/error.module.css'
import Head from 'next/head'

const errors = {
  400: 'Некорректный запрос',
  401: 'Необходима авторизация',
  403: 'Доступ запрещен',
  404: 'Страница не найдена',
  405: 'Метод не поддерживается',
  500: 'Непредвиденная ошибка',
  default: 'Неизвестная ошибка',
}

const Error = ({ statusCode }) => (
  <div className={styles.error}>
    <Head>
      <title>Горпром | Ошибка {statusCode}</title>
    </Head>
    <div className={styles.errorCode}>
      {statusCode}
    </div>
    <div className={styles.errorText}>
      {errors[statusCode] || errors.default}
    </div>
  </div>
)

export default Error
