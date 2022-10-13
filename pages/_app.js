import { Provider, Observer } from 'mobx-react'

import { useStore } from '../store'
import { modalsComponents } from '../modals'
import { getCookie } from '../helpers/cookie'
import { callPostApi } from '../helpers/fetch'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'

import Error from './_error'
import '../styles/globals.css'
import '../styles/variables.css'


const App = ({ Component, pageProps = {}, pageAllow, statusCode, initialStore = {}, ...other }) => {
  const store = useStore(initialStore)

  if (!statusCode && !pageAllow?.access) {
    return <Error statusCode={403} />
  }
  if (statusCode >= 400) {
    return <Error statusCode={statusCode} />
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
      <Component {...pageProps} />
    </Provider>
  )
}

App.getInitialProps = async({ ctx, router, res, err }) => {
  const initProps = {}
  const cookies = ctx.req ? ctx.req.headers.cookie : undefined
  const token = getCookie(cookies, 'token')
  if (token) {
    const verifyEndpoint = process.env.NEXT_PUBLIC_AUTH_API + 'verify-token/'
    const { data } = await callPostApi(verifyEndpoint, { headers: { Authorization: `Token ${token}` } })
    if (data.status === 'OK') {
      const account = Object.entries(data?.data || {}).reduce((memo, [key, value]) => {
        if (['abac', 'token'].includes(key)) {
          return memo
        }
        return { ...memo, [key]: value }
      }, {})
      initProps.abacRules = data?.data?.abac
      initProps.initialStore = {
        authData: {
          ...account,
          token,
        },
      }
    }
  }
  if (!initProps.abacRules) {
    initProps.abacRules = await getRules()
  }
  const context = getAbacContext({ ctx, router }, initProps.account)
  initProps.context = context
  initProps.pageAllow = getPageAllow({
    rules: initProps.abacRules,
    context,
    path: context.ctx.path,
  })

  if (ctx?.res) {
    initProps.statusCode = ctx.res.statusCode
  } else {
    initProps.statusCode = ctx?.err ? ctx.err.statusCode : 404
  }

  return initProps
}

export default App
