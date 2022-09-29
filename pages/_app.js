import Error from './_error'
import '../styles/globals.css'
import '../styles/variables.css'

const App = ({ Component, pageProps }) => {
  const { pageAllow, statusCode } = pageProps
  if (!statusCode && !pageAllow?.access) {
    return <Error statusCode={403} />
  }
  return <Component {...pageProps} />
}

export default App