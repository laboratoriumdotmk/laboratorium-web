import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 300

type Args = { params: Promise<{ vendor: string }> }

export default async function VendorPage({ params: paramsPromise }: Args) {
  const { vendor: slug } = await paramsPromise
  const vendor = await queryVendorBySlug(slug)
  if (!vendor) return notFound()

  const craft = typeof vendor.craft === 'string' ? vendor.craft : (vendor.craft as any)?.mk || ''
  const bio = typeof vendor.bio === 'string' ? vendor.bio : (vendor.bio as any)?.mk || ''

  return (
    <article className="container py-16 max-w-4xl">
      <nav className="type-label text-ink-muted mb-10" aria-label="Breadcrumb">
        <Link href="/market" className="hover:text-lab-accent">← Lab Design Market</Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Photo */}
        <div className="aspect-square overflow-hidden bg-cream-dark">
          {vendor.photo && typeof vendor.photo === 'object' ? (
            <Media resource={vendor.photo} imgClassName="w-full h-full object-cover" priority />
          ) : (
            <div className="w-full h-full halftone-bg flex items-center justify-center">
              <span className="text-5xl text-rule" aria-hidden="true">⚗</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {craft && <p className="type-label text-lab-accent mb-3">{craft}</p>}
          <h1 className="font-display text-4xl mb-4">{vendor.name}</h1>
          {vendor.joinedDate && (
            <p className="type-meta mb-4">
              Дел од Lab Design Market од {new Date(vendor.joinedDate).getFullYear()}
            </p>
          )}
          {bio && <p className="text-ink-faded leading-relaxed mb-6">{bio}</p>}

          {/* Social links */}
          <div className="flex gap-4 flex-wrap">
            {vendor.socials?.instagram && (
              <a
                href={vendor.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent border border-rule px-4 py-2 transition-colors"
              >
                Instagram ↗
              </a>
            )}
            {vendor.socials?.facebook && (
              <a
                href={vendor.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent border border-rule px-4 py-2 transition-colors"
              >
                Facebook ↗
              </a>
            )}
            {vendor.socials?.website && (
              <a
                href={vendor.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent border border-rule px-4 py-2 transition-colors"
              >
                Веб-сајт ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'vendors',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true },
    })
    return result.docs.map(({ slug }) => ({ vendor: slug }))
  } catch { return [] }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { vendor: slug } = await paramsPromise
  const vendor = await queryVendorBySlug(slug)
  if (!vendor) return {}
  const craft = typeof vendor.craft === 'string' ? vendor.craft : (vendor.craft as any)?.mk || ''
  const bio = typeof vendor.bio === 'string' ? vendor.bio : (vendor.bio as any)?.mk || ''
  return {
    title: vendor.name,
    description: `${craft ? craft + ' — ' : ''}${bio?.slice(0, 120)}`,
    alternates: { canonical: `${getServerSideURL()}/market/${slug}` },
  }
}

const queryVendorBySlug = cache(async (slug: string) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'vendors',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    })
    return result.docs?.[0] || null
  } catch { return null }
})
