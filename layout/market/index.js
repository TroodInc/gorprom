import { MobXProviderContext, observer } from 'mobx-react'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import Input from '../../components/Input'
import Button, { BUTTON_COLORS } from '../../components/Button'

import styles from './index.module.css'
import { ICONS_TYPES } from '../../components/Icon'
import SubMenu from '../../components/SubMenu'
import classNames from 'classnames'


const formStoreName = 'search'

const MarketLayout = ({ children }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { pathname, query: { type, search, from }, push } = router
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => store.deleteFormStore(formStoreName), [])
  useEffect(() => {
    if (!search) { store.deleteFormStore(formStoreName) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  const formStore = store.createFormStore(
    formStoreName,
    {
      form: {
        data: {
          type: type || 'ALL',
          search: search,
        },
      },
    },
  )
  const { form } = formStore

  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <Input
          className={styles.input}
          placeholder="Введите текст для поиска ..."
          value={form.get('data.search')}
          onChange={value => form.set('data.search', value)}
          onEnter={() => {
            console.log(form.get('data.search'))
            if (form.get('data.search')) {
              router.push(`/market/search?type=${
                form.get('data.type')
              }&search=${
                form.get('data.search')
              }&from=${from || pathname}`)
            }
          }}
        />
        <Button
          specialType={ICONS_TYPES.search}
          color={BUTTON_COLORS.white}
          className={classNames(styles.button, styles.searchBtn)}
          disabled={!form.get('data.search')}
          link={`/market/search?type=${
            form.get('data.type')
          }&search=${
            form.get('data.search')
          }&from=${from || pathname}`}
        />
        {search &&
            <Button
              className={classNames(styles.button, styles.clearBtn)}
              specialType={ICONS_TYPES.clear}
              color={BUTTON_COLORS.white}
              onClick={() => push(from || '/market')}
            />
        }
      </div>
      {!search &&
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Маркетплейс</h1>
              {!store?.authData?.id && (
                <Button
                  className={styles.registrationBtn}
                  label="Зарегистрироваться"
                  link="/registration"
                  color={BUTTON_COLORS.orange}
                />
              )}
            </div>
            <SubMenu
              className={styles.navigation}
              items={[
                { link: '/market/product', title: 'Товары' },
                { link: '/market/service', title: 'Услуги' },
                { link: '/market/company', title: 'Компании' },
              ]}
            />
          </>
      }
      {children}
    </div>
  )
}

export default observer(MarketLayout)
