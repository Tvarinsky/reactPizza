import Head from 'next/head'
import Layout from './components/Layout'
import CartContext from './components/context/CartContext'
import PromoContext from './components/context/PromoContext'
import {ModalContextWrapper} from './components/context/ModalContextState'
import Modals from './components/Modals'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <link rel="stylesheet" href={process.env.NEXT_PUBLIC_CLIENT_URL + '/mainPage.css'}/>
    </Head>
    <CartContext>
      <ModalContextWrapper>
          <PromoContext>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Modals/>
          </PromoContext>
      </ModalContextWrapper>
    </CartContext>

    </>
  )  
}

export default MyApp
