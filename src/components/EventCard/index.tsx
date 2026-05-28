import React from 'react'
import Link from 'next/link'
import type { Event } from '@/payload-types'
import { Media } from '@/components/Media'

interface EventCardProps {
  event: Event
  locale?: string
}

const typeLabels: Record<string, string> = {
  workshop: 'Работилница',
  concert: 'Концерт',
  exhibition: 'Изложба',
  screening: 'Проекција',
  seminar: 'Семинар',
  party: 'Забава',
  market: 'Пазар',
  other: 'Настан',
}

export function EventCard({ event, locale }: EventCardProps) {
  const title = typeof event.title === 'string' ? event.title : (event.title as any)?.[locale || 'mk'] || ''
  const summary = typeof event.summary === 'string' ? event.summary : (event.summary as any)?.[locale || 'mk'] || ''
  const typeLabel = typeLabels[event.type] || event.type

  const dateStr = event.startDateTime
    ? new Date(event.startDateTime).toLocaleDateString('mk-MK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <Link
      href={`/programs/${event.slug}`}
      className="group block border border-rule hover:border-ink transition-colors bg-cream"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark relative">
        {event.featuredImage && typeof event.featuredImage === 'object' ? (
          <Media
            resource={event.featuredImage}
            imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full halftone-bg flex items-center justify-center">
            <span className="text-3xl text-rule" aria-hidden="true">⚗</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-cream/90 type-label px-2 py-1 text-ink">
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {dateStr && <p className="type-meta mb-2">{dateStr}</p>}
        <h3 className="font-display text-xl leading-snug mb-2 group-hover:text-lab-accent transition-colors">
          {title}
        </h3>
        {summary && (
          <p className="text-ink-faded text-sm leading-relaxed line-clamp-2">{summary}</p>
        )}
        {typeof event.space === 'object' && event.space && (
          <p className="type-label text-ink-muted mt-3">
            {typeof (event.space as any).name === 'string'
              ? (event.space as any).name
              : (event.space as any).name?.[locale || 'mk'] || ''}
          </p>
        )}
      </div>
    </Link>
  )
}
