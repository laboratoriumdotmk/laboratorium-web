'use client'

import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'

/**
 * The mutating Laboratorium wordmark cycles through typographic treatments,
 * echoing the print-house origin of setting movable type.
 * On each cycle a new variant is "set" — different weight, spacing, italics,
 * small-caps, or case — giving the logo life without being gimmicky.
 */

const variants = [
  // 0 — default roman
  { text: 'LABORATORIUM', style: 'uppercase tracking-[0.18em] font-normal not-italic text-[0.9em]' },
  // 1 — italic serif
  { text: 'Laboratorium', style: 'italic font-light tracking-[-0.02em] text-[1.05em]' },
  // 2 — Cyrillic
  { text: 'ЛАБОРАТОРИУМ', style: 'uppercase tracking-[0.08em] font-normal not-italic text-[0.85em]' },
  // 3 — condensed / tight
  { text: 'LABORATORIUM', style: 'uppercase tracking-[-0.04em] font-semibold not-italic text-[0.95em]' },
  // 4 — loose italic
  { text: 'Laboratorium', style: 'italic font-normal tracking-[0.04em] text-[1em]' },
]

interface MutatingWordmarkProps {
  className?: string
  interval?: number
  /** If true, cycle on hover only, not automatically */
  hoverOnly?: boolean
}

export function MutatingWordmark({
  className = '',
  interval = 4000,
  hoverOnly = false,
}: MutatingWordmarkProps) {
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const current = variants[index]!

  useEffect(() => {
    if (hoverOnly) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % variants.length)
    }, interval)
    return () => clearInterval(id)
  }, [hoverOnly, interval])

  function handleMouseEnter() {
    setIsHovered(true)
    setIndex((i) => (i + 1) % variants.length)
  }

  function handleMouseLeave() {
    setIsHovered(false)
  }

  return (
    <span
      className={`relative inline-block font-display cursor-default select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Laboratorium"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`block ${current.style}`}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
