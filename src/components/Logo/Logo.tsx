import React from 'react'
import Link from 'next/link'
import { MutatingWordmark } from './MutatingWordmark'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`font-display no-underline text-foreground hover:text-foreground ${sizeMap[size]} ${className}`}
      aria-label="Laboratorium — home"
    >
      <MutatingWordmark />
    </Link>
  )
}

/** Static (server-render safe) version for OG images, email, etc. */
export function LogoStatic({ className = '', size = 'md' }: LogoProps) {
  return (
    <span
      className={`font-display uppercase tracking-[0.18em] ${sizeMap[size]} ${className}`}
      aria-label="Laboratorium"
    >
      LABORATORIUM
    </span>
  )
}

// Keep default export for backward compat with template
export default Logo
