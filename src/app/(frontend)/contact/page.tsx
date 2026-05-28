import React from 'react'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const revalidate = 3600

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="border-b-2 border-ink pb-6 mb-12">
        <p className="type-label text-lab-accent mb-2">Контакт</p>
        <h1 className="font-display text-5xl lg:text-6xl">Пишете ни</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <div className="mb-10">
            <p className="type-label text-ink-muted mb-4">Адреса</p>
            <address className="not-italic text-ink-faded leading-relaxed">
              <strong className="text-ink">Laboratorium</strong>
              <br />
              Бул. Климент Охридски 68
              <br />
              1000 Скопје, Северна Македонија
              <br />
              <span className="text-sm text-ink-muted">
                (влез и преку 12-та Македонска Ударна Бригада бр. 2А)
              </span>
            </address>
          </div>

          <div className="mb-10">
            <p className="type-label text-ink-muted mb-4">Контакт</p>
            <p>
              <a
                href="mailto:contact@laboratorium.mk"
                className="text-ink hover:text-lab-accent transition-colors"
              >
                contact@laboratorium.mk
              </a>
            </p>
            <p className="mt-1">
              <a
                href="tel:+38972905555"
                className="text-ink hover:text-lab-accent transition-colors"
              >
                +389 72 905 555
              </a>
            </p>
          </div>

          <div className="mb-10">
            <p className="type-label text-ink-muted mb-4">Лице за контакт</p>
            <p className="text-ink-faded">Калина Дуковска</p>
          </div>

          <div className="mb-10">
            <p className="type-label text-ink-muted mb-4">Социјални мрежи</p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/lab.ratorium"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/lab.rat.rium/"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://linktr.ee/lab.ratorium"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-ink hover:text-lab-accent transition-colors"
              >
                Linktree
              </a>
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="aspect-video bg-cream-dark border border-rule flex items-center justify-center">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.42,41.99,21.44,42.00&layer=mapnik&marker=41.9964,21.4314"
              className="w-full h-full border-0"
              title="Laboratorium location map"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Laboratorium+Skopje+Kliment+Ohridski+68"
            target="_blank"
            rel="noopener noreferrer"
            className="type-label text-ink-muted hover:text-lab-accent mt-2 inline-block transition-colors"
          >
            Отвори во Google Maps ↗
          </a>
        </div>

        {/* Form */}
        <div>
          <p className="type-label text-ink-muted mb-6">Испратете порака</p>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Контакт',
  description: 'Пишете ни на Laboratorium — Бул. Климент Охридски 68, Скопје.',
}
