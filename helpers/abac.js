import lodashGet from 'lodash/get'
import { isDefAndNotNull } from './def'
import { callGetApi } from './fetch'


const allow = 'allow'
const any = '*'
const defResolution = '_default_resolution'

const getRegexFromResource = res => {
  const regexStr = res
    .replace(/\*{2}/g, '.*')
    .replace(/\+{2}/g, '.+')
    .replace(/([^.])\*/g, '$1[^\\/]*')
    .replace(/([^.])\+/g, '$1[^\\/]+')
  return new RegExp(`^${regexStr}$`)
}

export const getAbacContext = (context, account) => {
  const url = new URL(`https://${context.ctx.req.headers.host}`)
  return {
    ctx: {
      host: url.hostname,
      path: context.router.asPath,
      route: context.router.route,
      query: context.router.query,
    },
    sbj: account,
  }
}

export const getPageResourceName = ({
  rules,
  domain,
  path,
}) => {
  const domainRules = rules[domain] || {}
  const resources = Object.keys(domainRules).filter(key => key !== defResolution)
  const resource = resources.sort((a, b) => b.length - a.length).find(res => {
    const regex = getRegexFromResource(res)
    return regex.exec(path)
  })
  return resource || null
}

const checkRule = (key, rule, values) => {
  if (rule === any) return true
  if (key === 'or' || key === 'and') {
    const arrayComparer = key === 'or' ? 'some' : 'every'
    return rule[arrayComparer](innerRule => {
      return Object.keys(innerRule).every(innerKey => checkRule(innerKey, innerRule[innerKey], values))
    })
  }

  let keyValue = lodashGet(values, key)
  if (isDefAndNotNull(keyValue) && typeof keyValue === 'object') {
    keyValue = keyValue.id
  }
  if (!isDefAndNotNull(keyValue)) keyValue = null

  if (!isDefAndNotNull(rule)) return rule === keyValue

  if (isDefAndNotNull(rule.in)) return rule.in.some(item => checkRule(key, item, values))
  if (isDefAndNotNull(rule.not)) return !checkRule(key, rule.not, values)

  let ruleValue = lodashGet(values, rule)
  ruleValue = (ruleValue || {}).id || ruleValue || rule

  if (isDefAndNotNull(rule.lt)) return keyValue < ruleValue
  if (isDefAndNotNull(rule.gt)) return keyValue > ruleValue

  return keyValue === ruleValue
}

const getSuitableRule = (actionRules = [], values = {}) => {
  return actionRules.find(({ rule }) => {
    return Object.keys(rule).every(key => checkRule(key, rule[key], values))
  })
}

const getSuitableRuleResult = (suitableRule, defaultAccess = true) => {
  if (process.env.NEXT_PUBLIC_SKIP_ABAC === 'true') {
    return {
      access: true,
      mask: [],
    }
  }
  if (suitableRule) {
    return {
      access: suitableRule.result === allow,
      mask: suitableRule.mask || [],
    }
  }
  return {
    access: defaultAccess,
    mask: [],
  }
}

export const ruleChecker = ({
  rules = {},
  domain,
  resource,
  action,
  values = {},
} = {}) => {
  const domainResources = rules[domain] || {}
  const globalDefaultResolution = rules[defResolution]
  const domainDefaultResolution = domainResources[defResolution]
  const defaultAccess = domainDefaultResolution === allow || globalDefaultResolution === allow
  const resourceKeys = Object.keys(domainResources).filter(key => {
    const regexp = domain === 'FRONTEND' ? getRegexFromResource(key) : new RegExp(key.replace('*', '.*'))
    return regexp.test(resource)
  }).sort().reverse()
  const resourceActions = resourceKeys.reduce((memo, curr) => ([
    ...memo,
    domainResources[curr],
  ]), [])
  let suitableRule
  resourceActions.forEach(resourceAction => {
    if (!suitableRule) {
      const actionKeys = Object.keys(resourceAction).filter(key => {
        const regexp = new RegExp(key.replace('*', '.*'))
        return regexp.test(action)
      }).sort().reverse()
      const actionRules = actionKeys.reduce((memo, curr) => ([
        ...memo,
        ...resourceAction[curr],
      ]), [])
      suitableRule = getSuitableRule(actionRules, values)
    }
  })

  return getSuitableRuleResult(suitableRule, defaultAccess)
}

export const getRules = async(authApiPath = '/') => {
  const abacEndpoint = authApiPath + 'abac/'
  const { data } = await callGetApi(abacEndpoint)
  return data?.data || {}
}

export const getPageAllow = ({ path, rules, context }) => {
  const resourceName = getPageResourceName({
    rules,
    domain: 'FRONTEND',
    path,
  })

  return ruleChecker({
    rules,
    domain: 'FRONTEND',
    resource: resourceName,
    action: 'view',
    values: context,
  })
}
