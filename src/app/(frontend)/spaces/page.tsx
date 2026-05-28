import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const revalidate = 300

const facilities = [
  'Bar & Café', 'Cinema', 'Event Space', 'Exhibition Space',
  'Indoor & Outdoor Communal Spaces', 'Library', 'Meeting / Workshop Room',
  'Shop', 'Stage / Rehearsal Room',
]

export default async function SpacesPage() {
  const spaces = await querySpaces()

  return (
    <div className="container py-16">
      {/* Page header */}
      <div className="border-b-2 border-ink pb-6 mb-12">
        <p className="type-label text-lab-accent mb-2">Просторот</p>
        <h1 className="font-display text-5xl lg:text-6xl">Нашите простори</h1>
        <p className="text-ink-faded mt-4 max-w-2xl leading-relaxed">
          Laboratorium е сместен во поранешната печатница на <em>Нова Македонија</em> —
          индустриски простор во самото срце на Скопје.
        </p>
      </div>

      {/* Facilities strip */}
      <div className="mb-16 p-6 bg-cream-dark">
        <p className="type-label text-ink-muted mb-4">Содржини</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {facilities.map((f) => (
            <li key={f} className="text-sm text-ink-faded">
              <span className="text-lab-accent mr-1">⚗</span>{f}
            </li>
          ))}
        </ul>
      </div>

      {/* Spaces */}
      <div className="space-y-20">
        {spaces.map((space, i) => {
          const name = typeof space.name === 'string' ? space.name : (space.name as any)?.mk || ''
          const use = typeof space.use === 'string' ? space.use : (space.use as any)?.mk || ''
          const images = space.images || []

          return (
            <section
              key={space.id}
              id={space.slug}
              className="grid lg:grid-cols-2 gap-10 items-start pt-10 border-t border-rule"
            >
              {/* Images */}
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {images.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className={`overflow-hidden bg-cream-dark ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                        style={{ transform: idx > 0 ? `rotate(${(idx % 2 === 0 ? 0.3 : -0.3)}deg)` : 'none' }}
                      >
                        {typeof img.image === 'object' && (
                          <Media
                            resource={img.image}
                            imgClassName="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video halftone-bg flex items-center justify-center">
                    <span className="text-4xl text-rule" aria-hidden="true">⚗</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h2 className="font-display text-3xl lg:text-4xl mb-3">{name}</h2>
                <div className="flex gap-4 mb-6">
                  {space.sizeSqm && (
                    <span className="type-meta">{space.sizeSqm} m²</span>
                  )}
                  {space.capacity && (
                    <span className="type-meta">{space.capacity} лица</span>
                  )}
                  {space.rentable && (
                    <span className="type-label text-lab-accent">На располагање</span>
                  )}
                </div>
                {use && <p className="text-ink-faded leading-relaxed mb-6">{use}</p>}

                {space.rentable && (
                  <Link
                    href={`/contact?subject=rent-space&space=${space.slug}`}
                    className="inline-block border border-ink text-ink hover:border-lab-accent hover:text-lab-accent type-label px-5 py-2.5 transition-colors"
                  >
                    Резервирај го просторот →
                  </Link>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-20 pt-10 border-t border-rule">
        <h2 className="font-display text-3xl mb-4">Изнајмете простор</h2>
        <p className="text-ink-faded mb-6 max-w-xl">
          Laboratorium нуди флексибилни просторни решенија за настани, работилници,
          изложби, концерти и деловни средби.
        </p>
        <Link
          href="/contact?subject=rent-space"
          className="inline-block bg-ink text-cream hover:bg-ink-faded type-label px-8 py-4 transition-colors"
        >
          Прашајте за резервација →
        </Link>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Простори',
  description:
    'Lab-Factory, Lab-Bar, Edu-Lab, Lab Living Room, Lab Design Market, Lab Re:store — шест уникатни простори во срцето на Скопје.',
}

const querySpaces = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'spaces',
      where: { _status: { equals: 'published' } },
      limit: 20,
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
})
