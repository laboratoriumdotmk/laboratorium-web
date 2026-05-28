'use client'

import React, { useState, useTransition } from 'react'
import { submitContactForm } from './action'

const subjectOptions = [
  { value: 'general', label: 'Општо прашање' },
  { value: 'rent-space', label: 'Изнајмување простор' },
  { value: 'volunteer', label: 'Доброволец' },
  { value: 'partner', label: 'Партнерство' },
  { value: 'host-event', label: 'Организирај настан' },
  { value: 'residency', label: 'Уметничка резиденција' },
  { value: 'become-maker', label: 'Стани мајстор' },
  { value: 'support', label: 'Поддршка / донација' },
]

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot check
    if (data.get('website')) return

    startTransition(async () => {
      const result = await submitContactForm(data)
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.error || 'Настана грешка. Обидете се повторно.')
      }
    })
  }

  if (status === 'success') {
    return (
      <div className="border border-rule p-8 text-center">
        <span className="text-3xl text-lab-accent block mb-3" aria-hidden="true">⚗</span>
        <h3 className="font-display text-2xl mb-2">Благодариме!</h3>
        <p className="text-ink-faded">
          Вашата порака е примена. Ние ќе одговориме наскоро.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="type-label block mb-1.5">
            Ime / Name <span className="text-lab-accent">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Вашето ime"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="type-label block mb-1.5">
            E-mail <span className="text-lab-accent">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vas@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-type" className="type-label block mb-1.5">
          Тема <span className="text-lab-accent">*</span>
        </label>
        <select id="cf-type" name="type" required defaultValue={defaultSubject || ''}>
          <option value="" disabled>Изберете тема…</option>
          {subjectOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="type-label block mb-1.5">
          Порака <span className="text-lab-accent">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Опишете ја вашата идеја, прашање, или потреба…"
        />
      </div>

      {status === 'error' && (
        <p className="text-lab-accent text-sm" role="alert">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink text-cream type-label px-8 py-3 hover:bg-ink-faded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Испраќање…' : 'Испрати порака →'}
      </button>
    </form>
  )
}
