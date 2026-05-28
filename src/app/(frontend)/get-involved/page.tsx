import React from 'react'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const revalidate = 3600

const paths = [
  {
    id: 'volunteer',
    label: 'Доброволец',
    emoji: '🤝',
    title: 'Стани доброволец',
    body: 'Помогни ни со организација на настани, технички работи, или едноставно биди дел од тимот. Секое доброволно дело е добредојдено!',
  },
  {
    id: 'partner',
    label: 'Партнер',
    emoji: '🤲',
    title: 'Партнерирај со нас',
    body: 'Имаш организација, бренд, или иницијатива? Заедно можеме да направиме поголемо влијание во заедницата.',
  },
  {
    id: 'host-event',
    label: 'Организирај настан',
    emoji: '🎪',
    title: 'Организирај настан кај нас',
    body: 'Имаш идеја за работилница, изложба, концерт, или презентација? Laboratorium е твојата сцена.',
  },
  {
    id: 'residency',
    label: 'Резиденција',
    emoji: '🎨',
    title: 'Уметничка резиденција',
    body: 'Уметник или истражувач? Пријави се за уметничка резиденција и работи во нашиот простор со пристап до нашата заедница.',
  },
  {
    id: 'become-maker',
    label: 'Мајстор',
    emoji: '🏺',
    title: 'Стани мајстор во Lab Design Market',
    body: 'Рачно правиш нешто убаво? Апликирај за место во Lab Design Market и продавај директно на нашите посетители.',
  },
  {
    id: 'support',
    label: 'Поддршка',
    emoji: '💛',
    title: 'Поддржи нè',
    body: 'Laboratorium е слободен простор. Секоја поддршка — финансиска или во вид — ни помага да останеме отворени за сите.',
  },
]

export default function GetInvolvedPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-cream border-b-2 border-ink py-20">
        <div className="container">
          <p className="type-label text-lab-accent mb-4">Заедница</p>
          <h1 className="font-display text-5xl lg:text-6xl leading-tight">Вклучи се</h1>
          <p className="text-ink-faded mt-4 max-w-2xl leading-relaxed text-lg">
            Laboratorium е отворен за секого. Има повеќе начини да бидеш дел —
            прочитај ги опциите и прати ни порака.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Paths grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paths.map((path) => (
            <div key={path.id} className="border border-rule p-6 hover:border-ink transition-colors">
              <span className="text-3xl block mb-3" role="img" aria-hidden="true">
                {path.emoji}
              </span>
              <p className="type-label text-lab-accent mb-2">{path.label}</p>
              <h2 className="font-display text-xl mb-3">{path.title}</h2>
              <p className="text-ink-faded text-sm leading-relaxed">{path.body}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="border-t border-rule pt-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-3xl mb-4">Пишете ни</h2>
              <p className="text-ink-faded leading-relaxed">
                Изберете го соодветниот тип на порака и кажете ни повеќе за вашата идеја.
                Ние одговараме во рок од 2–3 работни дена.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Вклучи се',
  description: 'Доброволец, партнер, мајстор, или уметник — Laboratorium е отворен за секого. Пронајди го својот начин за вклучување.',
}
