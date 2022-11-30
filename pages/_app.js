import { Provider, Observer, observer } from 'mobx-react'

import { useStore } from '../store'
import { modalsComponents } from '../modals'
import { callPostApi, getApiPath } from '../helpers/fetch'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'
import { getCookie } from '../helpers/cookie'
import AbacContext from '../abacContext'

import Error from './_error'
import Layout from '../layout/main'
import '../styles/fonts.css'
import '../styles/globals.css'
import '../styles/variables.css'
import Head from 'next/head'


const App = ({ Component, pageProps = {}, ...other }) => {
  const { pageAllow, statusCode, initialStore, abacRules, abacContext } = other
  const initData = {
    ...initialStore,
    ...pageProps.initialStore,
  }
  const store = useStore(initData)
  if (typeof window !== 'undefined') {
    window.cacheInitProps = {
      ...other,
      initialStore: {
        authData: store.authData,
      },
    }
  }

  const abacContextValue = {
    abacContext: {
      ...abacContext,
      sbj: store.authData,
    },
    abacRules,
  }

  let error = statusCode

  if (statusCode < 400 && !pageAllow?.access) error = 403

  if (error >= 400) {
    return (
      <Provider store={store}>
        <AbacContext.Provider value={abacContextValue}>
          <Layout {...other}>
            <Error statusCode={error} />
          </Layout>
        </AbacContext.Provider>
      </Provider>
    )
  }

  const layoutProps = Component.layoutProps ? Component.layoutProps : {}
  const SubLayout = Component.SubLayout ? Component.SubLayout : ({ children }) => children
  const subLayoutProps = Component.subLayoutProps ? Component.subLayoutProps : {}

  return (
    <Provider store={store}>
      <Head>
        <title>Горпром</title>
      </Head>
      <AbacContext.Provider value={abacContextValue}>
        <Observer>
          {() => {
            const { formStore } = store
            return Array.from(formStore.keys()).map((key) => {
              const fs = formStore.get(key)
              if (fs.modalComponent) {
                const Modal = modalsComponents[fs.modalComponent]
                if (Modal) {
                  return <Modal
                    {...fs.props}
                    host={other.host}
                    form={fs.form}
                    store={store}
                    key={key}
                    onClose={() => store.deleteFormStore(key)}
                  />
                }
              }
              return null
            })
          }}
        </Observer>
        <Layout layoutProps={layoutProps} {...other}>
          <SubLayout {...other} {...pageProps} {...subLayoutProps}>
            <Component {...other} {...pageProps} />
          </SubLayout>
        </Layout>
      </AbacContext.Provider>
    </Provider>
  )
}

const getUserInfo = async({ token, endpoint }) => {
  try {
    const { data } = await callPostApi(endpoint, { headers: { Authorization: `Token ${token}` } })
    const result = {}
    result.account = Object.entries(data?.data || {}).reduce((memo, [key, value]) => {
      if (['abac', 'token'].includes(key)) {
        return memo
      }
      return { ...memo, [key]: value }
    }, {})
    result.abacRules = data?.data?.abac
    return result
  } catch {
    return {}
  }
}

App.getInitialProps = async({ ctx, router, Component }) => {
  const { getInitialProps = () => ({}) } = Component
  if (!process.browser) {
    const protocol = ctx.req.headers['x-forwarded-proto'] || ctx.req.connection.encrypted ? 'https' : 'http'
    const host = `${protocol}://${ctx.req.headers.host}`
    const initProps = {
      host,
    }
    if (ctx?.res) {
      initProps.statusCode = ctx.res.statusCode
    } else {
      initProps.statusCode = ctx?.err ? ctx.err.statusCode : 404
    }
    if (ctx.req.headers['user-agent']?.includes('node-fetch')) {
      return {
        ...getInitialProps({ ctx, router }, initProps),
        ...initProps,
      }
    }
    const { token, reg } = ctx?.req?.cookies || {}
    const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
    if (token) {
      const verifyEndpoint = authApiPath + 'verify-token/'

      const { account, abacRules } = await getUserInfo({ token, endpoint: verifyEndpoint })

      initProps.account = account
      initProps.abacRules = abacRules
      initProps.initialStore = {
        authData: {
          ...account,
          token,
        },
      }
    } else if (reg) {
      initProps.initialStore = {
        authData: {
          login: reg,
        },
      }
    }
    if (!initProps.abacRules) {
      try {
        initProps.abacRules = await getRules(authApiPath)
      } catch {
        initProps.abacRules = {}
      }
    }
    const context = getAbacContext({ ctx, router }, initProps.account)
    initProps.abacContext = context
    initProps.pageAllow = getPageAllow({
      rules: initProps.abacRules,
      context,
      path: context.ctx.route,
    })

    return {
      ...getInitialProps({ ctx, router }, initProps),
      ...initProps,
    }
  } else {
    const { abacContext, abacRules, account } = window.cacheInitProps

    const newContext = {
      sbj: abacContext.sbj,
      ctx: {
        host: abacContext.ctx.host,
        path: ctx.asPath,
        route: ctx.pathname,
        query: ctx.query,
      },
    }

    const initProps = {
      abacContext: newContext,
      abacRules: abacRules,
      account: account,
      pageAllow: getPageAllow({
        rules: abacRules,
        context: newContext,
        path: newContext.ctx.route,
      }),
    }

    const host = `${window.location.protocol}//${window.location.host}`
    const token = getCookie(window.document.cookie, 'token')
    const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)

    if (token && !window.setInitPropsByToken) {
      const verifyEndpoint = authApiPath + 'verify-token/'

      const { account, abacRules } = await getUserInfo({ token, endpoint: verifyEndpoint })
      newContext.sbj = account
      initProps.abacContext = newContext
      initProps.abacRules = abacRules
      initProps.account = account
      initProps.pageAllow = getPageAllow({
        rules: abacRules,
        context: newContext,
        path: newContext.ctx.route,
      })
      window.setInitPropsByToken = true
    } else {
      window.setInitPropsByToken = false
    }

    return {
      ...getInitialProps({ ctx, router }, initProps),
      ...initProps,
    }
  }
}

export default observer(App)
