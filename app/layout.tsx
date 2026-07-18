import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FEG Connect - Marketplace Sous-traitance & Cotraitance B2B',
  description:
    'La marketplace B2B de la Fédération des Entreprises du Gabon. Mettez-vous en relation avec les entreprises membres — le réseau du secteur privé formel gabonais — et répondez aux appels d’offres. Le Label FEG en gage de confiance.',
  generator: 'v0.app',
  icons: {
    icon: [
      // Logo FEG : couleur sur onglets clairs, blanc sur onglets sombres.
      { url: '/images/logo-feg.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/images/logo_FEG_blanc.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/images/logo-feg.png', type: 'image/png' },
    ],
    apple: '/images/logo-feg.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`bg-background ${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
