import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { SessionProvider } from 'next-auth/react'
import GlobalAudioPlayer from './components/GlobalAudioPlayer'
import Footer from './components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Proud2Next',
  description: 'Next js 15',
}

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <head>
        <script defer src="https://umami-p00gs00gwcwo00s4k4c4kgg8.pictusweb.com/script.js" data-website-id="dda1780c-8861-4ad7-a963-0f347d73e476"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
          <GlobalAudioPlayer />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
