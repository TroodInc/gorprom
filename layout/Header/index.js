import Image from '../../components/Image'
import Link from '../../components/Link'
import Icon, { ICONS_TYPES } from '../../components/Icon'

import styles from './index.module.css'


const Header = ({ abacContext, abacRules }) => (
  <header className={styles.root}>
    <div className={styles.container}>
      <Image className={styles.logo} alt="Горпром" url="/image/logoDark.svg" />
      <div className={styles.menu}>
        {[
          { link: '/market', label: 'Маркетплейс' },
          { link: '/association', label: 'Ассоциация' },
          { link: '/niokr', label: 'НИОКР' },
          { link: '/education', label: 'Обучение' },
          { link: '/job', label: 'Биржа труда' },
        ].map(({ link, label }) => (
          <Link
            key={link}
            href={link}
            context={abacContext}
            rules = {abacRules}
            hideIfNotAllowed
          >
            {label}
          </Link>
        ))}
      </div>
      <div className={styles.buttons}>
        <Icon size={72} type={ICONS_TYPES.search} className={styles.button} />
        <Icon size={72} type={ICONS_TYPES.user} className={styles.button} />
      </div>
    </div>
  </header>
)

export default Header
