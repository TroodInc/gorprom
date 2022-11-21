import { MobXProviderContext, observer } from 'mobx-react'
import { Fragment, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import Input from '../../components/Input'
import Select from '../../components/Select'
import Button, { BUTTON_COLORS } from '../../components/Button'
import SubMenu from '../../components/SubMenu'

import styles from './index.module.css'
import Link from '../../components/Link'
import { getApiPath } from '../../helpers/fetch'
import Icon, { ICONS_TYPES } from '../../components/Icon'


const formStoreName = 'companySearch'

const CompanyLayout = ({ host, children }) => {
  const { store } = useContext(MobXProviderContext)
  const router = useRouter()
  const { pathname, query: { id, type, search } } = router
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
          type: search ? (type || 'ALL') : 'ALL',
          search,
        },
      },
    },
  )
  const { form } = formStore

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)

  const company = store.callHttpQuery(custodianApiPath + 'company/' + id)
  const companyName = company.get('data.data.name')
  const verify = company.get('data.data.verify')

  const path = pathname.replace('[id]', id)
  const mainPath = pathname.replace(/\[id].*/, id)

  return (
    <>
      <div className={styles.breadcrumbs}>
        {[
          { title: 'Маркетплейс', link: '/market' },
          { title: 'Компании', link: '/market/company' },
        ].map((item, i) => (
          <Fragment key={item.link}>
            {!!i && ' > '}
            <Link className={styles.link} href={item.link}>{item.title}</Link>
          </Fragment>
        ))}
      </div>
      <div className={styles.search}>
        <Select
          className={styles.select}
          items={[
            { value: 'ALL', label: 'Все' },
            { value: 'PRODUCT', label: 'Товары' },
            { value: 'SERVICE', label: 'Услуги' },
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
          link={`${mainPath}?type=${form.get('data.type')}&search=${form.get('data.search')}&from=${path}`}
        />
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {companyName}
          {verify &&
            <div className={styles.verify}>
              <Icon
                className={styles.verifyIcon}
                size={10}
                type={ICONS_TYPES.confirm}
              />
              <div className={styles.verifyText}>Верифицировано</div>
            </div>
          }
        </h1>
        <Button
          className={styles.button}
          label="Связаться"
          color={BUTTON_COLORS.orange}
          onClick={() => {
            const requestFormStoreName = 'requestCOMPANY' + id
            const requestFormStore = store.createFormStore(requestFormStoreName, {
              form: {
                data: {
                  target: {
                    _object: 'company',
                    id,
                  },
                  message_set: [
                    {
                      text: 'Отправлен запрос',
                    }],
                },
              },
            })
            requestFormStore.form.submit(custodianApiPath + 'order', 'POST')
              .then(() => router.push('/profile/request'))
          }}
        />
      </div>
      {!search && (
        <SubMenu
          className={styles.menu}
          items={[
            { link: mainPath, title: 'Товары и услуги', exact: true },
            { link: `${mainPath}/profile`, title: 'Профиль' },
            { link: `${mainPath}/requisites`, title: 'Реквизиты' },
          ]}
        />
      )}
      {children}
    </>
  )
}

export default observer(CompanyLayout)
