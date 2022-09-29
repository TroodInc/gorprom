import Head from 'next/head'
import Button from '../components/Button'
import Input from '../components/Input'
import { getPageAllow, getRules, getAbacContext } from '../helpers/abac'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Button label="Button" />
      <Input label="Input" />
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const rules = await getRules()
  const context = getAbacContext(ctx)
  const pageAllow = getPageAllow({ context, rules, path: context.ctx.path })

  return {
    props: {
      pageAllow,
    },
  }
}
