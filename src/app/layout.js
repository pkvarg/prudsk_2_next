import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
//import Header from './components/HeaderNew'
import Header from './components/Header'
import { ReduxProvider } from '@/providers/ReduxProvider'

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <Header />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
