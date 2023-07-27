import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <div className={styles.center}>
      <div className={styles.grid}>
        <Link href="https://github.com/Souhail99/Bank-smart-contract" 
          className={styles.card} 
          target='_blank'
          rel="noopener noreferrer"
        >
          <h2 className={styles.className_44d352}>Informations<span>&gt;</span></h2>
          <p className={styles.className_44d352}>Check the GitHub's ReadMe for more information.</p>
        </Link>
       
         
        <a></a>
        
        <a></a>
        <Link href="/bank" className={styles.card} rel="noopener noreferrer">
          <h2 className={styles.className_44d352}>Bank<span>&gt;</span></h2>
          <p className={styles.className_44d352}>Go to this page to perform actions like deposit, withdraw, and get rewards at the end! More explanations are provided on this page.</p>
        </Link>
      </div>
    </div>
    
    </>
  )
}