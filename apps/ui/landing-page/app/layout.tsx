import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'LogEngine - Open Source Log Management',
  description: 'Centralized logging system with gRPC performance, RabbitMQ queuing, and PostgreSQL reliability. Self-host or use our cloud.',
  keywords: ['logging', 'log management', 'open source', 'gRPC', 'observability', 'monitoring', 'self-hosted'],
  authors: [{ name: 'LogEngine Team' }],
  openGraph: {
    title: 'LogEngine - Open Source Log Management',
    description: 'High-performance centralized logging with gRPC, RabbitMQ, and PostgreSQL. Start logging in 3 lines of code.',
    url: 'https://logengine.io',
    siteName: 'LogEngine',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogEngine - Open Source Log Management',
    description: 'High-performance centralized logging with gRPC, RabbitMQ, and PostgreSQL.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
