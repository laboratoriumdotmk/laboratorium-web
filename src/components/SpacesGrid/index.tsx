import React from 'react'
import Link from 'next/link'
import type { Space } from '@/payload-types'
import { Media } from '@/components/Media'

interface SpacesGridProps {
  spaces: Space[]
  locale?: string
}

export function SpacesGrid({ spaces, locale = 'mk' }: SpacesGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space, i) => {
        const name = typeof space.name === 'string' ? space.name : (space.name as any)?.[locale] || ''
        const use = typeof space.use === 'string' ? space.use : (space.use as any)?.[locale] || ''
        const firstImage = space.images?.[0]?.image

        return (
          <Link
            key={space.id}
            href={`/spaces#${space.slug}`}
            className="group block border border-rule hover:border-ink transition-colors"
          >
            <div className="aspect-[3/2] overflow-hidden bg-cream-dark relative">
              {firstImage && typeof firstImage === 'object' ? (
                <Media
                  resource={firstImage}
                  imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full halftone-bg flex items-center justify-center">
                  <span className="text-2xl text-rule" aria-hidden="true">⚗</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-display text-lg group-hover:text-lab-accent transition-colors">
                  {name}
                </h3>
                {space.sizeSqm && (
                  <span className="type-meta shrink-0">{space.sizeSqm} m²</span>
                )}
              </div>
              {use && <p className="text-ink-faded text-sm leading-snug">{use}</p>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
