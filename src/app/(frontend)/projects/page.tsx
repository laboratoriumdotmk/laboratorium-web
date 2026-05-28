import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import { ProjectCard } from '@/components/ProjectCard'

export const revalidate = 300

export default async function ProjectsPage() {
  const projects = await queryProjects()
  const ongoing = projects.filter((p) => p.status === 'ongoing')
  const upcoming = projects.filter((p) => p.status === 'upcoming')
  const completed = projects.filter((p) => p.status === 'completed')

  return (
    <div className="container py-16">
      <div className="border-b-2 border-ink pb-6 mb-12">
        <p className="type-label text-lab-accent mb-2">Иницијативи</p>
        <h1 className="font-display text-5xl lg:text-6xl">Проекти</h1>
      </div>

      {ongoing.length > 0 && (
        <section className="mb-16">
          <p className="type-label text-ink-muted mb-8 ink-bar pt-4">Тековни</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoing.map((p) => <ProjectCard key={p.id} project={p as any} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-16">
          <p className="type-label text-ink-muted mb-8 border-t border-rule pt-8">Претстоени</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((p) => <ProjectCard key={p.id} project={p as any} />)}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <p className="type-label text-ink-muted mb-8 border-t border-rule pt-8 opacity-70">Завршени</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
            {completed.map((p) => <ProjectCard key={p.id} project={p as any} />)}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="py-20 text-center">
          <span className="text-5xl text-rule block mb-4" aria-hidden="true">⚗</span>
          <p className="font-display text-2xl text-ink-muted">Наскоро — следете нè!</p>
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Проекти',
  description: 'Иницијативи, програми и тековни проекти на Laboratorium — музика, пишување, занает, и уште многу.',
}

const queryProjects = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
})
