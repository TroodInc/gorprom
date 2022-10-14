import classNames from 'classnames'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getPageAllow } from '../../helpers/abac'


const Link = ({
  context = {},
  rules = {},
  href,
  className,
  activeClassName,
  children,
  hideIfNotAllowed,
  ...other
}) => {
  const { asPath } = useRouter()
  const linkActive = (new RegExp(`^${href}`)).test(asPath)
  const pageAllow = getPageAllow({ context, rules, path: href })
  const absoluteUrl = href.startsWith('http')
  if (!absoluteUrl && !pageAllow.access) {
    if (hideIfNotAllowed) {
      return null
    }
    return (
      <div className={className} {...other}>{children}</div>
    )
  }
  return (
    <NextLink href={href} {...other}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
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
