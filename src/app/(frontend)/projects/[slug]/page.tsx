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

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const project = await queryProjectBySlug({ slug, draft })
  if (!project) return notFound()

  const title = typeof project.title === 'string' ? project.title : (project.title as any)?.mk || ''
  const summary = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.mk || ''

  return (
    <article className="container py-16 max-w-4xl">
      {draft && <LivePreviewListener />}

      <nav className="type-label text-ink-muted mb-10" aria-label="Breadcrumb">
        <Link href="/projects" className="hover:text-lab-accent">← Проекти</Link>
      </nav>

      {/* Image collage */}
      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-10">
          {project.images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden bg-cream-dark ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
            >
              {typeof img.image === 'object' && (
                <Media resource={img.image} imgClassName="w-full h-full object-cover" priority={i === 0} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="border-b-2 border-ink pb-6 mb-10">
        {project.phase && (
          <span className="type-label text-lab-accent block mb-2">
            {project.phase === 'ongoing' ? 'Тековен проект' : project.phase === 'upcoming' ? 'Претстоен' : 'Завршен'}
          </span>
        )}
        <h1 className="font-display text-4xl lg:text-5xl">{title}</h1>
      </div>

      {summary && (
        <p className="font-display text-xl text-ink-faded italic leading-relaxed mb-8">{summary}</p>
      )}

      {project.body && (
        <div className="prose prose-lg max-w-none mb-10">
          <RichText data={project.body as any} />
        </div>
      )}

      {project.collaborators && project.collaborators.length > 0 && (
        <div className="border-t border-rule pt-8">
          <p className="type-label text-ink-muted mb-3">Соработници</p>
          <ul className="flex flex-wrap gap-4">
            {project.collaborators.map((c, i) => (
              <li key={i} className="text-sm">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-lab-accent">
                    <span className="text-lab-accent mr-1">⚗</span>
                    {c.name}{c.role && ` — ${c.role}`}
                  </a>
                ) : (
                  <span><span className="text-lab-accent mr-1">⚗</span>{c.name}{c.role && ` — ${c.role}`}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true },
    })
    return result.docs.map(({ slug }) => ({ slug }))
  } catch { return [] }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const project = await queryProjectBySlug({ slug, draft: false })
  if (!project) return {}
  const title = typeof project.title === 'string' ? project.title : (project.title as any)?.mk || ''
  const description = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.mk || ''
  return { title, description, alternates: { canonical: `${getServerSideURL()}/projects/${slug}` } }
}

const queryProjectBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      draft,
      limit: 1,
      overrideAccess: draft,
      where: { slug: { equals: slug } },
      depth: 2,
    })
    return result.docs?.[0] || null
  } catch { return null }
})
