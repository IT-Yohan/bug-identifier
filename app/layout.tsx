import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../src/theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bug Identifier - Professional Pest Control Solutions',
  description: 'Upload a photo of any insect or pest for instant identification and get professional pest control recommendations.',
  keywords: 'pest control, bug identification, insect identification, pest removal, extermination service',
  openGraph: {
    title: 'Bug Identifier - Professional Pest Control Solutions',
    description: 'Upload a photo of any insect or pest for instant identification and get professional pest control recommendations.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bug Identifier'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bug Identifier - Professional Pest Control Solutions',
    description: 'Upload a photo of any insect or pest for instant identification and get professional pest control recommendations.'
  },
  robots: {
    index: true,
    follow: true
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <NextIntlClientProvider>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
