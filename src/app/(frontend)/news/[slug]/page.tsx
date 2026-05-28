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

export const revalidate = 300

type Args = { params: Promise<{ slug: string }> }

export default async function NewsPostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const post = await queryPostBySlug({ slug, draft })
  if (!post) return notFound()

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('mk-MK', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <article className="container py-16 max-w-3xl">
      {draft && <LivePreviewListener />}

      <nav className="type-label text-ink-muted mb-10" aria-label="Breadcrumb">
        <Link href="/news" className="hover:text-lab-accent">← Вести</Link>
      </nav>

      {post.heroImage && typeof post.heroImage === 'object' && (
        <div className="aspect-video overflow-hidden bg-cream-dark mb-10">
          <Media resource={post.heroImage} imgClassName="w-full h-full object-cover" priority />
        </div>
      )}

      <div className="border-b-2 border-ink pb-6 mb-10">
        {dateStr && <p className="type-meta mb-3">{dateStr}</p>}
        <h1 className="font-display text-4xl lg:text-5xl">{post.title}</h1>
      </div>

      {post.content && (
        <div className="prose prose-lg max-w-none">
          <RichText data={post.content as any} />
        </div>
      )}
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true },
    })
    return result.docs.map(({ slug }) => ({ slug }))
  } catch { return [] }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug({ slug, draft: false })
  if (!post) return {}
  return {
    title: post.title,
    description: post.meta?.description || '',
    alternates: { canonical: `${getServerSideURL()}/news/${slug}` },
  }
}

const queryPostBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
      depth: 2,
    })
    return result.docs?.[0] || null
  } catch { return null }
})
