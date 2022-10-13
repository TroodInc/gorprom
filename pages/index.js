import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import Head from 'next/head'
import Button from '../components/Button'


const Home = () => {
  const { store } = useContext(MobXProviderContext)

  return (
    <div>
      <Head>
        <title>Горпром</title>
      </Head>
      <Button label="Open Modal" onClick={() => store.createFormStore('test', {
        modalComponent: 'Login',
      })} />
    </div>
  )
}

export default Home
