'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

// Simple in-memory rate limiter (resets on cold starts — good enough for basic protection)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 3
const WINDOW_MS = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count++
  return true
}

const ALLOWED_TYPES = [
  'general', 'rent-space', 'volunteer', 'partner',
  'host-event', 'residency', 'become-maker', 'support',
] as const

export async function submitContactForm(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  // Rate limit
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return { success: false, error: 'Многу барања. Обидете се повторно по 1 минута.' }
  }

  // Honeypot
  const honeypot = formData.get('website')
  if (honeypot) return { success: false, error: 'Спам детектиран.' }

  // Extract + sanitize fields
  const name = String(formData.get('name') || '').trim().slice(0, 200)
  const email = String(formData.get('email') || '').trim().slice(0, 200)
  const type = String(formData.get('type') || '').trim()
  const message = String(formData.get('message') || '').trim().slice(0, 5000)

  // Validate
  if (!name || name.length < 2) return { success: false, error: 'Внесете валидно ime.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Внесете валидна e-mail адреса.' }
  if (!ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number]))
    return { success: false, error: 'Изберете тема.' }
  if (!message || message.length < 10)
    return { success: false, error: 'Пораката мора да биде барем 10 знаци.' }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, type: type as 'general', message },
    })
    return { success: true }
  } catch (err) {
    console.error('Contact form error:', err)
    return { success: false, error: 'Настана грешка. Обидете се повторно.' }
  }
}
