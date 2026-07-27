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

// Without this phones render the page in a 980px virtual viewport — everything
// gets scaled down and the md: breakpoints never switch to the mobile layouts.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
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
