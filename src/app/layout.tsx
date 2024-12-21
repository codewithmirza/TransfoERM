import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TransfoERM',
  description: 'The All-in-One Business Automation Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100`}
        suppressHydrationWarning
      >
        <Providers>
          <main className="min-h-screen" suppressHydrationWarning>
            {children}
          </main>
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
