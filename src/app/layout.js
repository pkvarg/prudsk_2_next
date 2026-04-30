import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { SessionProvider } from 'next-auth/react'
import GlobalAudioPlayer from './components/GlobalAudioPlayer'
import Footer from './components/Footer'
import EbookSessionModal from './components/EbookSessionModal'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://prud.sk'),
  title: 'prud.sk',
  description: 'Distribúcia kresťanskej literatúry',
}

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
          <EbookSessionModal />
          <GlobalAudioPlayer />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
