import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { HomepageHero } from '@/components/Homepage/Hero'
import { EventCard } from '@/components/EventCard'
import { SpacesGrid } from '@/components/SpacesGrid'
import { ProjectCard } from '@/components/ProjectCard'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export default async function HomePage() {
  const [events, spaces, projects] = await Promise.all([
    queryFeaturedEvents(),
    querySpaces(),
    queryFeaturedProjects(),
  ])

  return (
    <>
      {/* ── Hero ── */}
      <HomepageHero />

      {/* ── Print-house origin ── */}
      <section className="container py-20 border-b border-rule">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="type-label text-lab-accent mb-4">Основано декември 2024</p>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
              Поранешна печатница на <em>Нова Македонија</em>
            </h2>
            <p className="text-ink-faded leading-relaxed mb-4">
              Laboratorium е сместен во огромниот, суров простор на поранешната печатница на
              националниот дневен весник <em>Нова Македонија</em> — простор кој млади уметници
              од различни дисциплини го претворија во живи, создавачки екосистем.
            </p>
            <p className="text-ink-faded leading-relaxed">
              Со поддршка на <strong>80+ партнерски организации</strong>, одржани <strong>180+ настани</strong>,
              и признание од Нов Европски Баухаус — ова е местото каде Скопје го покажува
              своето вистинско потенцијал.
            </p>
          </div>
          <div className="halftone-bg p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <span className="text-8xl text-rule" aria-hidden="true">⚗</span>
              <p className="type-label text-ink-muted mt-6">[ фотографии — наскоро ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className="container py-20 border-b border-rule">
        <p className="type-label text-ink-muted mb-10">Наша мисија</p>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              n: '01',
              title: 'Заедница и креативен простор',
              body: 'Слободен, гостопримлив, повеќенаменски простор каде идните уметници и создавачи се среќаваат, разменуваат идеи и создаваат заедно. Работилници, предавања, концерти, изложби, проекции.',
            },
            {
              n: '02',
              title: 'Инкубатор за социјални проекти',
              body: 'Настани и иницијативи, реализирани директно или со партнери, насочени кон подобрување на културната и социјалната средина — особено кон помладите генерации.',
            },
            {
              n: '03',
              title: 'Заживување на занаетчиството',
              body: 'Lab Design Market ги оживува македонскиот занает и дизајн, ги прави привлечни за младите луѓе, и им нуди на мајсторите директен канал за продажба.',
            },
          ].map((p) => (
            <div key={p.n} className="border-t-2 border-ink pt-6">
              <span className="type-meta block mb-3">{p.n}</span>
              <h3 className="font-display text-2xl mb-4">{p.title}</h3>
              <p className="text-ink-faded leading-relaxed text-sm">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      {events.length > 0 && (
        <section className="container py-20 border-b border-rule">
          <div className="flex items-baseline justify-between mb-10">
            <p className="type-label text-ink-muted">Претстојни настани</p>
            <Link href="/programs" className="type-label text-lab-accent hover:underline">
              Сите настани →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── Spaces Grid ── */}
      {spaces.length > 0 && (
        <section className="container py-20 border-b border-rule">
          <div className="flex items-baseline justify-between mb-10">
            <p className="type-label text-ink-muted">Нашите простори</p>
            <Link href="/spaces" className="type-label text-lab-accent hover:underline">
              Сите простори →
            </Link>
          </div>
          <SpacesGrid spaces={spaces as any[]} />
        </section>
      )}

      {/* ── Featured Projects ── */}
      {projects.length > 0 && (
        <section className="container py-20 border-b border-rule">
          <div className="flex items-baseline justify-between mb-10">
            <p className="type-label text-ink-muted">Проекти</p>
            <Link href="/projects" className="type-label text-lab-accent hover:underline">
              Сите проекти →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── Market Teaser ── */}
      <section className="bg-ink text-cream py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="type-label text-lab-accent mb-4">Lab Design Market</p>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
                15+ македонски дизајнери и мајстори
              </h2>
              <p className="text-cream/70 leading-relaxed mb-8">
                Lab Design Market ги спојува оние кои создаваат со оние кои ценат — изложбен
                простор и заедница за македонски дизајн и занает.
              </p>
              <Link
                href="/market"
                className="inline-block border border-cream text-cream hover:border-lab-accent hover:text-lab-accent px-6 py-3 type-label transition-colors"
              >
                Откријте ги мајсторите →
              </Link>
            </div>
            <div className="border border-cream/20 p-8">
              <p className="type-label text-lab-accent mb-3">Lab Re:store</p>
              <p className="text-cream/70 leading-relaxed text-sm">
                Мал маркет за препроцесирање и репурпозирање на постара мода и акцесоари —
                одржливост со стил.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Awards / Networks ── */}
      <section className="container py-16 border-b border-rule">
        <p className="type-label text-ink-muted mb-8">Признанија и мрежи</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'New European Bauhaus Award 2024', sub: 'Finalist' },
            { name: 'Trans Europe Halles', sub: 'TEH' },
            { name: 'European Network of Cultural Centres', sub: 'ENCC' },
            { name: 'European Creative Hubs Network', sub: 'ECHN' },
          ].map((badge) => (
            <div key={badge.name} className="border border-rule p-5">
              <span className="text-lab-accent text-xl block mb-2" aria-hidden="true">⚗</span>
              <p className="font-display text-sm leading-snug">{badge.name}</p>
              <p className="type-label text-ink-muted mt-1">{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-5xl lg:text-6xl leading-tight mb-6">Вклучи се.</h2>
          <p className="text-ink-faded leading-relaxed mb-8 text-lg">
            Доброволец, партнер, уметник во резиденција, или едноставно гостин —
            Laboratorium е отворен за секого.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/get-involved"
              className="bg-ink text-cream hover:bg-ink-faded px-8 py-4 type-label transition-colors"
            >
              Вклучи се →
            </Link>
            <Link
              href="/contact"
              className="border border-ink text-ink hover:border-lab-accent hover:text-lab-accent px-8 py-4 type-label transition-colors"
            >
              Контактирај нè
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Laboratorium — Едукативен Културен Центар, Скопје',
  description:
    'Laboratorium е слободен културно-едукативен центар во Скопје — лабораторија за убави нешта. 180+ настани, 80+ партнери.',
  alternates: { canonical: getServerSideURL() },
}

const queryFeaturedEvents = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'events',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { startDateTime: { greater_than: now } },
        ],
      },
      sort: 'startDateTime',
      limit: 6,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
})

const querySpaces = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'spaces',
      where: { _status: { equals: 'published' } },
      limit: 8,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
})

const queryFeaturedProjects = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { status: { equals: 'ongoing' } },
        ],
      },
      limit: 6,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
})
