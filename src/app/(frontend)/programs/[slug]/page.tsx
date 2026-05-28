import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

type Args = { params: Promise<{ slug: string }> }

export default async function EventPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug, draft })

  if (!event) return notFound()

  const title = typeof event.title === 'string' ? event.title : (event.title as any)?.mk || ''
  const summary = typeof event.summary === 'string' ? event.summary : (event.summary as any)?.mk || ''

  const dateStr = event.startDateTime
    ? new Date(event.startDateTime).toLocaleDateString('mk-MK', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const isUpcoming = event.startDateTime
    ? new Date(event.startDateTime) > new Date()
    : false

  // Build .ics content
  const icsLink = `/api/events/${slug}.ics`

  return (
    <article className="container py-16 max-w-4xl">
      {draft && <LivePreviewListener />}

      {/* Breadcrumb */}
      <nav className="type-label text-ink-muted mb-10" aria-label="Breadcrumb">
        <Link href="/programs" className="hover:text-lab-accent">← Програма</Link>
      </nav>

      {/* Hero image */}
      {event.featuredImage && typeof event.featuredImage === 'object' && (
        <div className="aspect-video overflow-hidden mb-10 bg-cream-dark">
          <Media
            resource={event.featuredImage}
            imgClassName="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* Meta strip */}
      <div className="border-b-2 border-ink pb-6 mb-10">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="bg-ink text-cream type-label px-3 py-1 text-xs">{event.type}</span>
          {isUpcoming && (
            <span className="border border-lab-accent text-lab-accent type-label px-3 py-1 text-xs">
              ПРЕТСТОЕН
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl lg:text-5xl mb-4">{title}</h1>
        {dateStr && <p className="type-meta">{dateStr}</p>}
        {event.endDateTime && (
          <p className="type-meta text-ink-muted">
            До: {new Date(event.endDateTime).toLocaleString('mk-MK')}
          </p>
        )}
        {typeof event.space === 'object' && event.space && (
          <p className="type-label text-ink-faded mt-2">
            📍{' '}
            {typeof (event.space as any).name === 'string'
              ? (event.space as any).name
              : (event.space as any).name?.mk || ''}
          </p>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <p className="font-display text-xl text-ink-faded italic leading-relaxed mb-8">{summary}</p>
      )}

      {/* Body */}
      {event.body && (
        <div className="prose prose-lg max-w-none mb-10">
          <RichText data={event.body as any} />
        </div>
      )}

      {/* Partners */}
      {event.partners && event.partners.length > 0 && (
        <div className="border-t border-rule pt-8 mb-8">
          <p className="type-label text-ink-muted mb-3">Партнери</p>
          <ul className="flex flex-wrap gap-4">
            {event.partners.map((p, i) => (
              <li key={i}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label text-ink hover:text-lab-accent transition-colors"
                  >
                    <span className="text-lab-accent mr-1">⚗</span>
                    {p.name}
                  </a>
                ) : (
                  <span className="type-label">
                    <span className="text-lab-accent mr-1">⚗</span>
                    {p.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lab-accent text-cream type-label px-6 py-3 hover:bg-lab-accent-hover transition-colors"
          >
            Резервирај место →
          </a>
        )}
        {isUpcoming && (
          <a
            href={icsLink}
            className="border border-ink text-ink hover:border-lab-accent hover:text-lab-accent type-label px-6 py-3 transition-colors"
            download
          >
            + Додај во календар (.ics)
          </a>
        )}
        <Link
          href="/contact?subject=host-event"
          className="border border-rule text-ink-muted hover:border-ink hover:text-ink type-label px-6 py-3 transition-colors"
        >
          Организирај настан
        </Link>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true },
    })
    return result.docs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const event = await queryEventBySlug({ slug, draft: false })
  if (!event) return {}
  const title = typeof event.title === 'string' ? event.title : (event.title as any)?.mk || ''
  const description = typeof event.summary === 'string' ? event.summary : (event.summary as any)?.mk || ''
  return {
    title,
    description,
    alternates: { canonical: `${getServerSideURL()}/programs/${slug}` },
  }
}

const queryEventBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      draft,
      limit: 1,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
      depth: 2,
    })
    return result.docs?.[0] || null
  } catch {
    return null
  }
})
