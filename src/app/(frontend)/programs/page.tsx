import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import { EventCard } from '@/components/EventCard'

export const revalidate = 60

export default async function ProgramsPage() {
  const { upcoming, past } = await queryEvents()

  return (
    <div className="container py-16">
      {/* Page header */}
      <div className="border-b-2 border-ink pb-6 mb-12">
        <p className="type-label text-lab-accent mb-2">Програма</p>
        <h1 className="font-display text-5xl lg:text-6xl">Настани</h1>
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section className="mb-16">
          <p className="type-label text-ink-muted mb-8 ink-bar pt-4">Претстојни</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        </section>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <section>
          <p className="type-label text-ink-muted mb-8 border-t border-rule pt-8">Минати настани</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {past.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="py-20 text-center">
          <span className="text-5xl text-rule block mb-4" aria-hidden="true">⚗</span>
          <p className="font-display text-2xl text-ink-muted">Наскоро — следете нè!</p>
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Програма и Настани',
  description: 'Работилници, концерти, изложби, проекции и семинари на Laboratorium во Скопје.',
}

const queryEvents = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date().toISOString()
    const [upcomingRes, pastRes] = await Promise.all([
      payload.find({
        collection: 'events',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { startDateTime: { greater_than: now } },
          ],
        },
        sort: 'startDateTime',
        limit: 50,
        depth: 1,
      }),
      payload.find({
        collection: 'events',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { startDateTime: { less_than: now } },
          ],
        },
        sort: '-startDateTime',
        limit: 30,
        depth: 1,
      }),
    ])
    return { upcoming: upcomingRes.docs, past: pastRes.docs }
  } catch {
    return { upcoming: [], past: [] }
  }
})
