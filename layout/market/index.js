import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import Input from '../../components/Input'
import Select from '../../components/Select'
import Button, { BUTTON_COLORS } from '../../components/Button'

import styles from './index.module.css'


const formStoreName = 'search'

const MarketLayout = ({ children }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => store.deleteFormStore(formStoreName), [])
  const { pathname, query } = router
  const formStore = store.createFormStore(
    formStoreName,
    {
      form: {
        data: {
          type: query?.type || 'ALL',
          search: query?.search,
        },
      },
    },
  )
  const { form } = formStore

  return (
    <>
      <div className={styles.search}>
        <Select
          className={styles.select}
          items={[
            { value: 'ALL', label: 'Все' },
            { value: 'PRODUCT', label: 'Товары' },
            { value: 'SERVICE', label: 'Услуги' },
            { value: 'COMPANY', label: 'Компании' },
          ]}
          values={form.get('data.type') ? [form.get('data.type')] : []}
          onChange={values => form.set('data.type', values[0])}
        />
        <div className={styles.splitter} />
        <Input
          className={styles.input}
          placeholder="Введите текст для поиска..."
          value={form.get('data.search')}
          onChange={value => form.set('data.search', value)}
        />
        <Button
          className={styles.button}
          disabled={!form.get('data.search')}
          label="Поиск"
          link={`/market/search?type=${
            form.get('data.type')
          }&search=${
            form.get('data.search')
          }&from=${query?.from || pathname}`}
        />
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>Маркетплейс</h1>
        {!store?.authData?.id && (
          <Button
            label="Стать участником"
            link="/registration"
            color={BUTTON_COLORS.orange}
          />
        )}
      </div>
      {children}
    </>
  )
}

export default observer(MarketLayout)
