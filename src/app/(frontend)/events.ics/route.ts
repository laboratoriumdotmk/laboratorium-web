import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { NextRequest } from 'next/server'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

function esc(s: string) {
  return s.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

function fmtDt(dt: string) {
  // Format: 20241231T180000Z
  return new Date(dt).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export async function GET(_req: NextRequest) {
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
    limit: 100,
    depth: 0,
  })

  const baseUrl = getServerSideURL()

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Laboratorium//Skopje//MK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Laboratorium Скопје`,
    `X-WR-CALDESC:Програма на Laboratorium — едукативен културен центар`,
    `X-WR-TIMEZONE:Europe/Skopje`,
  ]

  for (const event of result.docs) {
    const title = typeof event.title === 'string' ? event.title : (event.title as any)?.mk || ''
    const summary = typeof event.summary === 'string' ? event.summary : (event.summary as any)?.mk || ''
    const start = event.startDateTime ? fmtDt(event.startDateTime) : null
    const end = event.endDateTime ? fmtDt(event.endDateTime) : null
    if (!start) continue

    lines.push(
      'BEGIN:VEVENT',
      `UID:lab-${event.id}@laboratorium.mk`,
      `DTSTART:${start}`,
      ...(end ? [`DTEND:${end}`] : []),
      `SUMMARY:${esc(title)}`,
      ...(summary ? [`DESCRIPTION:${esc(summary)}`] : []),
      `URL:${baseUrl}/programs/${event.slug}`,
      `LOCATION:Laboratorium\\, Blvd. Kliment Ohridski 68\\, Skopje`,
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="laboratorium-events.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
