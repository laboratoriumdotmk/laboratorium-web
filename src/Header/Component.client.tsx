'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header | null
}

const localeLabels: Record<string, string> = {
  mk: 'МКД',
  en: 'ENG',
}

const localeAlternate: Record<string, string> = {
  mk: 'en',
  en: 'mk',
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const menuRef = useRef<HTMLDivElement>(null)

  // Derive current locale from path prefix
  const locale = pathname.startsWith('/en') ? 'en' : 'mk'
  const altLocale = localeAlternate[locale] || 'en'
  const altHref = locale === 'mk'
    ? `/en${pathname}`
    : pathname.replace(/^\/en/, '') || '/'

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-shadow duration-200',
        scrolled
          ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_#D4CEC4]'
          : 'bg-cream border-b border-rule',
      ].join(' ')}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navItems.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="link"
                className="type-label text-ink hover:text-lab-accent transition-colors"
              />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Locale toggle */}
            <Link
              href={altHref}
              hrefLang={altLocale}
              className="type-label text-ink-muted hover:text-ink border border-rule px-2 py-1 transition-colors"
              aria-label={`Switch to ${altLocale === 'mk' ? 'Македонски' : 'English'}`}
            >
              {localeLabels[altLocale]}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span className={`block w-5 h-px bg-ink transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`block w-5 h-px bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-ink transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="lg:hidden py-6 border-t border-rule"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="link"
                  className="type-label text-ink hover:text-lab-accent py-1"
                />
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
