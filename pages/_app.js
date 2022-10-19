import { Provider, Observer } from 'mobx-react'

import { useStore } from '../store'
import { modalsComponents } from '../modals'
import { callPostApi, getApiPath } from '../helpers/fetch'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'
import AbacContext from '../abacContext'

import Error from './_error'
import Layout from '../layout'
import '../styles/fonts.css'
import '../styles/globals.css'
import '../styles/variables.css'


const App = ({ Component, pageProps = {}, ...other }) => {
  const { pageAllow, statusCode, initialStore } = other
  const store = useStore(initialStore)
  if (typeof window !== 'undefined') {
    window.cacheInitProps = other
  }

  if (!pageAllow?.access) {
    return (
      <AbacContext.Provider value={other}>
        <Layout {...other}>
          <Error statusCode={403} />
        </Layout>
      </AbacContext.Provider>
    )
  }

  if (statusCode >= 400) {
    return (
      <AbacContext.Provider value={other}>
        <Layout {...other}>
          <Error statusCode={statusCode} />
        </Layout>
      </AbacContext.Provider>
    )
  }

  const layoutProps = Component.layoutProps ? Component.layoutProps : {}

  return (
    <Provider store={store}>
      <AbacContext.Provider value={other}>
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
                    form={fs.form}
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
          <Component {...other} {...pageProps} />
        </Layout>
      </AbacContext.Provider>
    </Provider>
  )
}

App.getInitialProps = async({ ctx, router }) => {
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
      return initProps
    }
    const { token } = ctx?.req?.cookies || {}
    const authApiPath = getApiPath(process.env.NEXT_PUBLIC_AUTH_API, host)
    if (token) {
      const verifyEndpoint = authApiPath + 'verify-token/'
      try {
        const { data } = await callPostApi(verifyEndpoint, { headers: { Authorization: `Token ${token}` } })
        initProps.account = Object.entries(data?.data || {}).reduce((memo, [key, value]) => {
          if (['abac', 'token'].includes(key)) {
            return memo
          }
          return { ...memo, [key]: value }
        }, {})
        initProps.abacRules = data?.data?.abac
        initProps.initialStore = {
          authData: {
            ...initProps.account,
            token,
          },
        }
      } catch {}
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

    return initProps
  } else {
    const newContext = {
      sbj: window.cacheInitProps.abacContext.sbj,
      ctx: {
        host: window.cacheInitProps.abacContext.ctx.host,
        path: ctx.asPath,
        route: ctx.pathname,
        query: ctx.query,
      },
    }

    return {
      abacContext: newContext,
      abacRules: window.cacheInitProps.abacRules,
      account: window.cacheInitProps.account,
      pageAllow: getPageAllow({
        rules: window.cacheInitProps.abacRules,
        context: newContext,
        path: newContext.ctx.route,
      }),
    }
  }
}

export default App
