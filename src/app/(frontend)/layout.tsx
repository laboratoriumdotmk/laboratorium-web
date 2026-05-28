import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Spectral } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { LocalBusinessJsonLd } from '@/components/JsonLd'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const spectral = Spectral({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, spectral.variable)}
      lang="mk"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <LocalBusinessJsonLd url={getServerSideURL()} />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Laboratorium — Едукативен Културен Центар, Скопје',
    template: '%s | Laboratorium',
  },
  description:
    'Laboratorium е слободен културно-едукативен центар во Скопје — лабораторија за убави нешта.',
  keywords: ['Laboratorium', 'Skopje', 'cultural center', 'Скопје', 'Лабораториум'],
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    site: '@lab_ratorium',
  },
}
