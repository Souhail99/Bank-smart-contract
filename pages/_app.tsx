import '../styles/globals.css'
import type { AppProps } from 'next/app'
import HeaderComponent from "../components/header"

import styles from '../styles/Home.module.css'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main className={styles.main}>
        <div>
          <HeaderComponent mode={'light'}></HeaderComponent>
        </div>
          <Component {...pageProps} />
      </main> 
    </>
  ) 
}