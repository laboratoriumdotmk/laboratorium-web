import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { CMSLink } from '@/components/Link'
import { LogoStatic } from '@/components/Logo/Logo'
import type { SiteSettings } from '@/payload-types'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSettings | null

  const navItems = footerData?.navItems || []
  const contact = siteSettings?.contact
  const social = siteSettings?.social
  const awards = siteSettings?.awards?.items || []
  const footerText = siteSettings?.footerText

  return (
    <footer className="mt-auto bg-ink text-cream">
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand + mission */}
          <div className="lg:col-span-1">
            <LogoStatic className="text-cream text-lg mb-4 block" />
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Слободен културно-едукативен центар во Скопје — лабораторија за убави нешта.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label text-cream/60 hover:text-lab-accent transition-colors"
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label text-cream/60 hover:text-lab-accent transition-colors"
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
              {social?.linktree && (
                <a
                  href={social.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label text-cream/60 hover:text-lab-accent transition-colors"
                  aria-label="Linktree"
                >
                  LT
                </a>
              )}
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-1">
            <p className="type-label text-cream/40 mb-4">Навигација</p>
            <nav className="flex flex-col gap-2">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className="text-cream/70 hover:text-lab-accent text-sm transition-colors"
                />
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <p className="type-label text-cream/40 mb-4">Контакт</p>
            <address className="not-italic text-sm text-cream/70 flex flex-col gap-2">
              {contact?.address && (
                <span className="leading-snug">{contact.address}</span>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-lab-accent transition-colors"
                >
                  {contact.email}
                </a>
              )}
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="hover:text-lab-accent transition-colors"
                >
                  {contact.phone}
                </a>
              )}
              {contact?.hours && (
                <span className="text-cream/50">{contact.hours}</span>
              )}
            </address>
          </div>

          {/* Awards & networks */}
          <div className="lg:col-span-1">
            <p className="type-label text-cream/40 mb-4">Признанија</p>
            <ul className="flex flex-col gap-2">
              {awards.map((badge, i) => (
                <li key={i} className="text-sm text-cream/70">
                  {badge.url ? (
                    <a
                      href={badge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lab-accent transition-colors"
                    >
                      <span className="text-lab-accent mr-1">⚗</span>
                      {badge.name as string}
                    </a>
                  ) : (
                    <span>
                      <span className="text-lab-accent mr-1">⚗</span>
                      {badge.name as string}
                    </span>
                  )}
                </li>
              ))}
              {/* Fallback hard-coded badges if not seeded yet */}
              {awards.length === 0 && (
                <>
                  <li className="text-sm text-cream/70"><span className="text-lab-accent mr-1">⚗</span>New European Bauhaus Award 2024 — Finalist</li>
                  <li className="text-sm text-cream/70"><span className="text-lab-accent mr-1">⚗</span>Trans Europe Halles (TEH)</li>
                  <li className="text-sm text-cream/70"><span className="text-lab-accent mr-1">⚗</span>ENCC Member</li>
                  <li className="text-sm text-cream/70"><span className="text-lab-accent mr-1">⚗</span>ECHN Member</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter teaser */}
        <div className="mt-12 pt-8 border-t border-cream/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="type-label text-cream/40 mb-1">Билтен / Newsletter</p>
              <p className="text-cream/60 text-sm">
                Добивајте вести за настани и програми директно во вашата инбокс.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-cream/20 text-cream hover:border-lab-accent hover:text-lab-accent px-5 py-2.5 text-sm transition-colors"
            >
              Пишете ни
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom credit bar */}
      <div className="border-t border-cream/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="type-label text-cream/30 text-xs">
            {footerText as string || `© ${new Date().getFullYear()} Laboratorium — Едукативен Културен Центар`}
          </p>
          <p className="type-label text-cream/20 text-xs">
            Blvd. Kliment Ohridski 68, 1000 Skopje, North Macedonia
          </p>
        </div>
      </div>
    </footer>
  )
}
