'use client'

import React from 'react'
import Link from 'next/link'
import { MutatingWordmark } from '@/components/Logo/MutatingWordmark'
import { motion } from 'motion/react'

export function HomepageHero() {
  return (
    <section className="relative overflow-hidden bg-cream border-b-2 border-ink">
      {/* Registration marks — print-house motif */}
      <span className="absolute top-4 left-4 type-meta text-rule hidden lg:block" aria-hidden="true">
        ⊕ REG.MARK
      </span>
      <span className="absolute top-4 right-4 type-meta text-rule hidden lg:block" aria-hidden="true">
        LAB.MK ⊕
      </span>

      <div className="container py-24 lg:py-36">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.p
            className="type-label text-lab-accent mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Скопје, Македонија — Основано декември 2024
          </motion.p>

          {/* Mutating wordmark — the living logo */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MutatingWordmark
              className="text-[clamp(3.5rem,10vw,8rem)] leading-none text-ink"
              interval={3500}
            />
          </motion.div>

          {/* Manifesto tagline */}
          <motion.p
            className="font-display text-2xl lg:text-4xl text-ink-faded italic leading-snug mb-10 max-w-3xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Лабораторија за убави нешта.
          </motion.p>

          <motion.p
            className="font-display text-xl lg:text-2xl text-ink-faded italic leading-snug mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            &ldquo;Laboratorium представува она на кое Скопје има потенцијал да биде.&rdquo;
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <Link
              href="/programs"
              className="bg-ink text-cream hover:bg-lab-accent px-8 py-4 type-label transition-colors"
            >
              Програма →
            </Link>
            <Link
              href="/about"
              className="border border-ink text-ink hover:border-lab-accent hover:text-lab-accent px-8 py-4 type-label transition-colors"
            >
              За нас
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 pt-10 border-t border-rule grid grid-cols-3 gap-6 max-w-2xl">
          {[
            { n: '180+', label: 'Настани' },
            { n: '80+', label: 'Партнери' },
            { n: 'Dec 2024', label: 'Основано' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl lg:text-4xl text-ink">{s.n}</p>
              <p className="type-label text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative halftone corner */}
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-30 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4CEC4 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />
    </section>
  )
}
