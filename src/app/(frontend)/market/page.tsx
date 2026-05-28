import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const revalidate = 300

export default async function MarketPage() {
  const vendors = await queryVendors()

  return (
    <div>
      {/* Hero */}
      <div className="bg-ink text-cream py-20">
        <div className="container">
          <p className="type-label text-lab-accent mb-4">Пазар</p>
          <h1 className="font-display text-5xl lg:text-6xl leading-tight mb-6">
            Lab Design Market
          </h1>
          <p className="text-cream/70 max-w-2xl leading-relaxed text-lg">
            Заедница на македонски дизајнери и мајстори — изложбен простор за занает, дизајн
            и рачна изработка. 15+ локални брендови под еден покрив.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* About section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-16 border-b border-rule">
          <div>
            <h2 className="font-display text-3xl mb-4">За Lab Design Market</h2>
            <p className="text-ink-faded leading-relaxed mb-4">
              Lab Design Market е простор за заживување на македонскиот занает и дизајн.
              Нашата цел е да ги направиме занаетчиските професии атрактивни за младите луѓе,
              и да им понудиме на мајсторите директен канал за продажба.
            </p>
            <p className="text-ink-faded leading-relaxed">
              Секој бренд е избран рачно — предност имаат уникатни, рачно изработени предмети
              со македонска приказна.
            </p>
          </div>
          <div className="border border-rule p-6">
            <p className="type-label text-lab-accent mb-4">Lab Re:store</p>
            <p className="text-ink-faded leading-relaxed mb-4">
              Мал маркет за препроцесирање и репурпозирање на постара мода и акцесоари.
              Одржливост со стил — секогаш добредојдени се нови парчиња.
            </p>
            <Link
              href="/contact?subject=become-maker"
              className="type-label text-ink hover:text-lab-accent transition-colors"
            >
              Донирајте парче →
            </Link>
          </div>
        </div>

        {/* Makers directory */}
        <div>
          <p className="type-label text-ink-muted mb-8 ink-bar pt-4">
            Мајстори и дизајнери ({vendors.length})
          </p>

          {vendors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor) => {
                const craft = typeof vendor.craft === 'string' ? vendor.craft : (vendor.craft as any)?.mk || ''
                const bio = typeof vendor.bio === 'string' ? vendor.bio : (vendor.bio as any)?.mk || ''

                return (
                  <Link
                    key={vendor.id}
                    href={`/market/${vendor.slug}`}
                    className="group block border border-rule hover:border-ink transition-colors"
                  >
                    <div className="aspect-square overflow-hidden bg-cream-dark">
                      {vendor.photo && typeof vendor.photo === 'object' ? (
                        <Media
                          resource={vendor.photo}
                          imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full halftone-bg flex items-center justify-center">
                          <span className="text-3xl text-rule" aria-hidden="true">⚗</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg group-hover:text-lab-accent transition-colors mb-1">
                        {vendor.name}
                      </h3>
                      {craft && <p className="type-label text-ink-muted">{craft}</p>}
                      {bio && <p className="text-ink-faded text-sm mt-2 leading-snug line-clamp-2">{bio}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <span className="text-5xl text-rule block mb-4" aria-hidden="true">⚗</span>
              <p className="font-display text-2xl text-ink-muted">Наскоро!</p>
            </div>
          )}
        </div>

        {/* Join CTA */}
        <div className="mt-16 pt-10 border-t border-rule grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl mb-3">Станете дел од Lab Design Market</h2>
            <p className="text-ink-faded leading-relaxed">
              Дизајнер, мајстор, или занаетчија? Ни пишете — следиме за нови членови.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/contact?subject=become-maker"
              className="bg-ink text-cream hover:bg-ink-faded type-label px-6 py-3 transition-colors"
            >
              Апликирајте →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Lab Design Market',
  description: '15+ македонски дизајнери и мајстори под еден покрив — изложбен простор за занает и дизајн во Скопје.',
}

const queryVendors = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'vendors',
      where: { _status: { equals: 'published' } },
      sort: 'name',
      limit: 100,
      depth: 1,
    })
    return result.docs
  } catch { return [] }
})
