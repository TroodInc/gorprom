import { Provider, Observer } from 'mobx-react'

import { useStore } from '../store'
import { modalsComponents } from '../modals'
import { callPostApi, getApiPath } from '../helpers/fetch'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'

import Error from './_error'
import Layout from '../Layout'
import '../styles/fonts.css'
import '../styles/globals.css'
import '../styles/variables.css'


const App = ({ Component, pageProps = {}, ...other }) => {
  const { pageAllow, statusCode, initialStore = {} } = other
  const store = useStore(initialStore)

  if (!pageAllow?.access) {
    return (
      <Layout {...other}>
        <Error statusCode={403} />
      </Layout>
    )
  }

  if (statusCode >= 400) {
    return (
      <Layout {...other}>
        <Error statusCode={statusCode} />
      </Layout>
    )
  }

  return (
    <Provider store={store}>
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
      <Layout {...other}>
        <Component {...other} {...pageProps} />
      </Layout>
    </Provider>
  )
}

App.getInitialProps = async({ ctx, router }) => {
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
  if (initProps.statusCode >= 400 && ctx.req.headers['user-agent']?.includes('node-fetch')) {
    return initProps
  }
  const { token } = ctx?.req?.cookies || {}
  const authApiPath = getApiPath(host, process.env.NEXT_PUBLIC_AUTH_API)
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
    path: context.ctx.path,
  })

  return initProps
}

export default App
