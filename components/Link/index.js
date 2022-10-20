import { useContext } from 'react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import AbacContext from '../../abacContext'
import { getPageAllow } from '../../helpers/abac'


const Link = ({
  href,
  className,
  activeClassName,
  children,
  hideIfNotAllowed,
  onClick,
  ...other
}) => {
  const { abacContext, abacRules } = useContext(AbacContext)
  const { asPath } = useRouter()
  const absoluteUrl = href.startsWith('http')
  let linkActive
  if (!absoluteUrl) {
    linkActive = (new RegExp(`^${href}`)).test(asPath)
    const pageAllow = getPageAllow({
      context: abacContext,
      rules: abacRules,
      path: href,
    })
    if (!pageAllow.access) {
      if (hideIfNotAllowed) {
        return null
      }
      return (
        <div className={className} onClick={onClick} {...other}>{children}</div>
      )
    }
  }
  return (
    <NextLink href={href} {...other}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        onClick={onClick}
        target={absoluteUrl ? '_blank' : undefined}
        rel={absoluteUrl ? 'noreferrer' : undefined}
        className={classNames(className, linkActive && activeClassName)}
      >
        {children}
      </a>
    </NextLink>
  )
}

export default Link
