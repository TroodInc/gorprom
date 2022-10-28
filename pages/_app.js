import { Provider, Observer } from 'mobx-react'

import { useStore } from '../store'
import { modalsComponents } from '../modals'
import { callPostApi, getApiPath } from '../helpers/fetch'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'
import AbacContext from '../abacContext'

import Error from './_error'
import Layout from '../layout/main'
import '../styles/fonts.css'
import '../styles/globals.css'
import '../styles/variables.css'
import Head from 'next/head'


const App = ({ Component, pageProps = {}, ...other }) => {
  const { pageAllow, statusCode, initialStore } = other
  const initData = {
    ...initialStore,
    ...pageProps.initialStore,
  }
  const store = useStore(initData)
  if (typeof window !== 'undefined') {
    window.cacheInitProps = other
  }

  let error = statusCode

  if (!pageAllow?.access) error = 403

  if (statusCode >= 400) {
    return (
      <Provider store={store}>
        <AbacContext.Provider value={other}>
          <Layout {...other}>
            <Error statusCode={error} />
          </Layout>
        </AbacContext.Provider>
      </Provider>
    )
  }

  const layoutProps = Component.layoutProps ? Component.layoutProps : {}
  const SubLayout = Component.SubLayout ? Component.SubLayout : ({ children }) => children

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
        <Head>
          <title>Горпром</title>
        </Head>
        <Layout layoutProps={layoutProps} {...other}>
          <SubLayout {...other}>
            <Component {...other} {...pageProps} />
          </SubLayout>
        </Layout>
      </AbacContext.Provider>
    </Provider>
  )
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

    const redirect = '/registration'
    if (initProps.account?.id && !initProps.account?.active && context.ctx.route !== redirect) {
      ctx.res.writeHead(302, {
        Location: redirect,
        'Content-Type': 'text/html; charset=utf-8',
      })
      ctx.res.end()
    }

    return {
      ...getInitialProps({ ctx, router }, initProps),
      ...initProps,
    }
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

    const initProps = {
      abacContext: newContext,
      abacRules: window.cacheInitProps.abacRules,
      account: window.cacheInitProps.account,
      pageAllow: getPageAllow({
        rules: window.cacheInitProps.abacRules,
        context: newContext,
        path: newContext.ctx.route,
      }),
    }

    const redirect = '/registration'
    if (initProps.account?.id && !initProps.account?.active && ctx.asPath !== redirect) {
      router.replace(redirect)
    }

    return {
      ...getInitialProps({ ctx, router }, initProps),
      ...initProps,
    }
  }
}

export default App
