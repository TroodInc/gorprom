import { useContext } from 'react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import escapeRegExp from 'lodash/escapeRegExp'

import AbacContext from '../../abacContext'
import { getPageAllow } from '../../helpers/abac'


const Link = ({
  href,
  ssr,
  className,
  activeClassName,
  activeWithQuery = [],
  exact,
  children,
  hideIfNotAllowed,
  onClick,
  download,
  target,
  ...other
}) => {
  const { abacContext, abacRules } = useContext(AbacContext)
  const { asPath, query } = useRouter()

  if (!href) {
    return <span className={className} onClick={onClick} {...other}>{children}</span>
  }

  const absoluteUrl = href.startsWith('http')
  let linkActive
  if (!absoluteUrl) {
    const mainPath = asPath.match(/^([^?#]*)/)[1]
    if (exact) {
      linkActive = href === mainPath
    } else {
      linkActive = (new RegExp(`^${escapeRegExp(href)}`)).test(mainPath)
    }
    if (activeWithQuery.length) {
      const search = (href.match(/\?(.*)/) || [])[1]
      const params = new URLSearchParams(search)
      linkActive = activeWithQuery.reduce((memo, key) => {
        return memo && (query[key] === (params.get(key) || undefined))
      }, linkActive)
    }
    const pageAllow = getPageAllow({
      context: abacContext,
      rules: abacRules,
      path: mainPath,
    })
    if (!pageAllow.access) {
      if (hideIfNotAllowed) {
        return null
      }
      return (
        <span className={className} onClick={onClick} {...other}>{children}</span>
      )
    }
  }

  let realTarget = absoluteUrl ? '_blank' : undefined
  realTarget = realTarget || target

  if (ssr) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={href}
        onClick={onClick}
        className={classNames(className, linkActive && activeClassName)}
        target={realTarget}
        rel={realTarget ? 'noreferrer' : undefined}
        download={download}
      >
        {children}
      </a>
    )
  }
  return (
    <NextLink href={href} {...other}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        onClick={onClick}
        target={realTarget}
        rel={realTarget ? 'noreferrer' : undefined}
        className={classNames(className, linkActive && activeClassName)}
        download={download}
      >
        {children}
      </a>
    </NextLink>
  )
}

export default Link
