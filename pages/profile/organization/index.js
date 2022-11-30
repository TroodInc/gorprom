import { MobXProviderContext, observer } from 'mobx-react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'
import ProfileLayout from '../../../layout/profile'

import styles from './index.module.css'
import { getApiPath } from '../../../helpers/fetch'
import { toPhone } from '../../../helpers/format'
import { ruleChecker } from '../../../helpers/abac'
import Button, { BUTTON_COLORS, BUTTON_SPECIAL_TYPES, BUTTON_TYPES } from '../../../components/Button'
import Icon, { ICONS_TYPES } from '../../../components/Icon'
import Link from '../../../components/Link'
import AbacContext from '../../../abacContext'

const Organization = ({ host }) => {
  const { store } = useContext(MobXProviderContext)
  const { profile: { company } } = store.authData
  const { push } = useRouter()
  const { abacContext, abacRules } = useContext(AbacContext)

  if (!company) {
    return (
      <Button
        type={BUTTON_TYPES.text}
        specialType={BUTTON_SPECIAL_TYPES.plus}
        color={BUTTON_COLORS.orange}
        label="Добавить организацию"
        link="/profile/organization/edit"
      />
    )
  }

  const custodianApiPath = getApiPath(process.env.NEXT_PUBLIC_CUSTODIAN_API, host)
  const companyCall = store.callHttpQuery(custodianApiPath + 'company/' + company)

  const companyData = companyCall.get('data.data') || {}
  const companyAddress = companyCall.get('data.data.address') || {}
  const verify = companyData.verify

  const { access } = ruleChecker({
    rules: abacRules,
    domain: 'CUSTODIAN',
    resource: 'company',
    action: 'data_PATCH',
    values: {
      ...abacContext,
      obj: companyData,
    },
  })

  return (
    <>
      <div className={styles.header}>
        <h2>Профиль организации</h2>
        {access && (
          <Icon
            className={styles.pencil}
            size={32}
            type={ICONS_TYPES.pencil}
            onClick={() => push('/profile/organization/edit')}
          />
        )}
      </div>
      <div className={styles.root}>
        <div className={styles.left}>
          <Image
            alt="Logo"
            src={companyData.logo || '/image/defaultLogo.jpg'}
            height={90}
            width={140}
            objectFit="contain"
            objectPosition="top"
          />
          <Icon
            className={classNames(styles.verifyIcon, verify && styles.active)}
            type={ICONS_TYPES.confirm}
            size={10}
          />
          <div className={classNames(styles.verifyText, verify && styles.active)}>
            {verify ? 'Верифицировано' : 'Неверифицировано'} Ассоциацией НП &laquo;Горнопромышленники России&raquo;
          </div>
          <div>
              Подробнее про верификацию по ссылке<br/>
            <Link
              className={styles.link}
              href={'/agreement'}
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Название
              </div>
              <div className={styles.value}>
                {companyData.name}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Форма собственности
              </div>
              <div className={styles.value}>
                {companyData.ownership_type?.name}
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.title}>
                Структура организации
              </div>
              <div className={styles.value}>
                {companyData.department_type?.name}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Тип организации
              </div>
              <div className={styles.value}>
                {companyData.company_types?.map(t => t.name).join(', ')}
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.title}>
                Тип деятельности
              </div>
              <div className={styles.value}>
                {
                  [
                    ...(companyData.work_type || []).map(t => t.name),
                    companyData.other_work_type,
                  ]
                    .filter(Boolean)
                    .join(', ')
                }
              </div>
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.block}>
              <div className={styles.value}>
                Адрес
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Регион / район
              </div>
              <div className={styles.value}>
                {companyAddress.region}
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.title}>
                Город / н.п.
              </div>
              <div className={styles.value}>
                {companyAddress.city}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Улица
              </div>
              <div className={styles.value}>
                {companyAddress.street}
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.title}>
                Дом
              </div>
              <div className={styles.value}>
                {companyAddress.house}
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.block}>
              <div className={styles.title}>
                Квартира / офис
              </div>
              <div className={styles.value}>
                {companyAddress.flat}
              </div>
            </div>
          </div>
          <div className={classNames(styles.row, styles.additionalGap)}>
            <div className={styles.block}>
              <div className={styles.value}>
                Контакты
              </div>
            </div>
          </div>
          {companyData.site && (
            <div className={styles.row}>
              <div className={styles.block}>
                <div className={styles.title}>
                  Веб-сайт
                </div>
                <Link
                  className={classNames(styles.value, styles.link)}
                  href={'https://' + companyData.site}
                >
                  {companyData.site}
                </Link>
              </div>
            </div>
          )}
          {companyData.contact_set?.map(item => (
            <div key={item.id} className={styles.row}>
              <div className={styles.block}>
                <div className={styles.title}>
                  {item.comment}
                </div>
                <div className={styles.value}>
                  +{toPhone(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

Organization.SubLayout = ProfileLayout

export default observer(Organization)
