import Header from './Header'
import Cart from './Cart'
import Footer from './Footer'
import Head from 'next/head'

function Layout({children, pageProps}) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"/>
                <link rel="stylesheet" href={process.env.NEXT_PUBLIC_CLIENT_URL + '/header.css'}/>
            </Head>
            <Header/>
            <Cart/>
                {children}
            <Footer/>
        </>
    )

}

export default Layout;