import React from 'react'

interface LocalBusinessJsonLdProps {
  url?: string
}

export function LocalBusinessJsonLd({ url = 'https://laboratorium.mk' }: LocalBusinessJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PerformingArtsTheater'],
    name: 'Laboratorium',
    alternateName: 'Лабораториум',
    description:
      'Free cultural-educational center in Skopje — a laboratory of beautiful things. Workshops, concerts, exhibitions, and community programs.',
    url,
    telephone: '+38972905555',
    email: 'contact@laboratorium.mk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Blvd. Kliment Ohridski 68',
      addressLocality: 'Skopje',
      postalCode: '1000',
      addressCountry: 'MK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.9964,
      longitude: 21.4314,
    },
    sameAs: [
      'https://instagram.com/lab.ratorium',
      'https://www.facebook.com/lab.rat.rium/',
      'https://linktr.ee/lab.ratorium',
    ],
    foundingDate: '2024-12-01',
    areaServed: {
      '@type': 'City',
      name: 'Skopje',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface EventJsonLdProps {
  name: string
  startDate: string
  endDate?: string
  description?: string
  location?: string
  url?: string
  imageUrl?: string
}

export function EventJsonLd({
  name,
  startDate,
  endDate,
  description,
  location = 'Laboratorium, Blvd. Kliment Ohridski 68, Skopje, MK',
  url,
  imageUrl,
}: EventJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    location: {
      '@type': 'Place',
      name: 'Laboratorium',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Blvd. Kliment Ohridski 68',
        addressLocality: 'Skopje',
        postalCode: '1000',
        addressCountry: 'MK',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Laboratorium',
      url: 'https://laboratorium.mk',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
