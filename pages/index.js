import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import Head from 'next/head'
import Button from '../components/Button'
import FileInput from '../components/FileInput'
import Select from '../components/Select'


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
      <FileInput />
      <Select
        type="filterDropdown"
        label="Select"
        placeholder="Select"
        items={[{ label: 'Val 1', value: 1 }, { label: 'Val 2', value: 2 }]}
      />
    </div>
  )
}

export default Home
