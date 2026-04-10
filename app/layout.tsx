import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NovaSec – Network Security Expert',
  description: 'Portfolio of a network security professional specializing in penetration testing, threat intelligence, and security consulting.',
  metadataBase: new URL('https://novasec.net'),
  openGraph: {
    title: 'NovaSec – Network Security Expert',
    description: 'Penetration Testing · Threat Intelligence · Security Consulting',
    url: 'https://novasec.net',
    siteName: 'NovaSec',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
