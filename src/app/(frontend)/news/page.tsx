import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const revalidate = 300

export default async function NewsPage() {
  const posts = await queryPosts()

  return (
    <div className="container py-16">
      <div className="border-b-2 border-ink pb-6 mb-12">
        <p className="type-label text-lab-accent mb-2">Вести</p>
        <h1 className="font-display text-5xl lg:text-6xl">Дневник</h1>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const title = typeof post.title === 'string' ? post.title : (post.title as any)?.mk || ''
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('mk-MK', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
              : ''

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className={`group block ${i === 0 ? 'md:col-span-2' : ''}`}
              >
                {post.heroImage && typeof post.heroImage === 'object' && (
                  <div className={`overflow-hidden bg-cream-dark mb-4 ${i === 0 ? 'aspect-video' : 'aspect-[4/3]'}`}>
                    <Media
                      resource={post.heroImage}
                      imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <p className="type-meta mb-2">{dateStr}</p>
                <h2 className={`font-display group-hover:text-lab-accent transition-colors leading-snug ${i === 0 ? 'text-3xl' : 'text-xl'}`}>
                  {title}
                </h2>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <span className="text-5xl text-rule block mb-4" aria-hidden="true">⚗</span>
          <p className="font-display text-2xl text-ink-muted">Наскоро — следете нè!</p>
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Вести и Дневник',
  description: 'Вести, соопштенија и приказни од Laboratorium — едукативен културен центар во Скопје.',
}

const queryPosts = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
      depth: 1,
    })
    return result.docs
  } catch { return [] }
})
