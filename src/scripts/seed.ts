// @ts-nocheck
/**
 * Seed script — pnpm seed
 * Populates Laboratorium with verified real content from BRIEF.md §1–§2.
 *
 * Usage:
 *   cp .env.example .env.local  # fill in DATABASE_URI + PAYLOAD_SECRET
 *   pnpm seed
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Seeding Laboratorium…')

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@laboratorium.mk'
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'changeme123'

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      context: { disableRevalidate: true },
      data: {
        name: 'Laboratorium Admin',
        email: adminEmail,
        password: adminPass,
        roles: ['admin'],
      },
    })
    console.log(`  ✓ Admin user: ${adminEmail}`)
  } else {
    console.log('  · Admin user already exists, skipping.')
  }

  // ── Site Settings ───────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    context: { disableRevalidate: true },
    data: {
      siteName: 'Laboratorium',
      tagline: { mk: 'Лабораторија за убави нешта.', en: 'A laboratory of beautiful things.' },
      contact: {
        email: 'contact@laboratorium.mk',
        notificationEmail: process.env.CONTACT_EMAIL || 'contact@laboratorium.mk',
        phone: '+389 72 905 555',
        phoneAlt: '+389 2 314 2044',
        address: 'Blvd. Kliment Ohridski 68, 1000 Skopje, North Macedonia',
        hours: {
          mk: 'Секој ден, вечерта за настани (часовите ги потврдете со тимот)',
          en: 'Daily, evenings for events (confirm exact hours with the team)',
        },
        contactPerson: 'Kalina Dukovska',
      },
      social: {
        instagram: 'https://instagram.com/lab.ratorium',
        facebook: 'https://www.facebook.com/lab.rat.rium/',
        linktree: 'https://linktr.ee/lab.ratorium',
      },
      awards: {
        items: [
          {
            name: { mk: 'New European Bauhaus Award 2024 — Финалист', en: 'New European Bauhaus Award 2024 — Finalist' },
            url: 'https://new-european-bauhaus.europa.eu',
          },
          {
            name: { mk: 'Trans Europe Halles (TEH)', en: 'Trans Europe Halles (TEH)' },
            url: 'https://teh.net',
          },
          {
            name: { mk: 'European Network of Cultural Centres (ENCC)', en: 'European Network of Cultural Centres (ENCC)' },
            url: 'https://encc.eu',
          },
          {
            name: { mk: 'European Creative Hubs Network (ECHN)', en: 'European Creative Hubs Network (ECHN)' },
            url: 'https://creativehubs.eu',
          },
        ],
      },
      footerText: {
        mk: `© ${new Date().getFullYear()} Laboratorium — Едукативен Културен Центар, Скопје`,
        en: `© ${new Date().getFullYear()} Laboratorium — Educational Cultural Center, Skopje`,
      },
    },
  })
  console.log('  ✓ Site Settings')

  // ── Header Nav ──────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { type: 'custom', url: '/', label: { mk: 'Дома', en: 'Home' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/about', label: { mk: 'За нас', en: 'About' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/spaces', label: { mk: 'Простори', en: 'Spaces' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/programs', label: { mk: 'Програма', en: 'Programs' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/market', label: { mk: 'Пазар', en: 'Market' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/projects', label: { mk: 'Проекти', en: 'Projects' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/get-involved', label: { mk: 'Вклучи се', en: 'Get Involved' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/news', label: { mk: 'Вести', en: 'News' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/contact', label: { mk: 'Контакт', en: 'Contact' }, appearance: 'link' } },
      ],
    },
  })
  console.log('  ✓ Header navigation')

  // ── Footer Nav ──────────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { type: 'custom', url: '/about', label: { mk: 'За нас', en: 'About' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/programs', label: { mk: 'Програма', en: 'Programs' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/market', label: { mk: 'Пазар', en: 'Market' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/contact', label: { mk: 'Контакт', en: 'Contact' }, appearance: 'link' } },
        { link: { type: 'custom', url: '/get-involved', label: { mk: 'Вклучи се', en: 'Get Involved' }, appearance: 'link' } },
      ],
    },
  })
  console.log('  ✓ Footer navigation')

  // ── Spaces ──────────────────────────────────────────────────────────────────
  const spacesData = [
    {
      name: { mk: 'Lab-Factory', en: 'Lab-Factory' },
      slug: 'lab-factory',
      sizeSqm: 750,
      use: {
        mk: 'Главна сцена / главна сала. Простор за концерти, изложби, настани, проекции и поголеми настани.',
        en: 'Main stage / main hall. Space for concerts, exhibitions, events, screenings and larger gatherings.',
      },
      rentable: true,
    },
    {
      name: { mk: 'Lab-Bar & Тераса', en: 'Lab-Bar & Terrace' },
      slug: 'lab-bar',
      sizeSqm: 150,
      use: {
        mk: 'Мала сцена + бар/кафе. Интимни настани, концерти и дружења.',
        en: 'Small stage + bar/café. Intimate events, concerts and social gatherings.',
      },
      rentable: true,
    },
    {
      name: { mk: 'Edu-Lab', en: 'Edu-Lab' },
      slug: 'edu-lab',
      sizeSqm: 100,
      use: {
        mk: 'Училница / работилница. Работилници, предавања, семинари и едукативни програми.',
        en: 'Classroom / workshop room. Workshops, talks, seminars and educational programs.',
      },
      rentable: true,
    },
    {
      name: { mk: 'Lab Living Room', en: 'Lab Living Room' },
      slug: 'lab-living-room',
      sizeSqm: 25,
      use: {
        mk: 'Изложбен простор. Мали изложби, претставувања и арт-инсталации.',
        en: 'Exhibition space. Small exhibitions, presentations and art installations.',
      },
      rentable: false,
    },
    {
      name: { mk: 'Lab Design Market', en: 'Lab Design Market' },
      slug: 'lab-design-market',
      use: {
        mk: 'Изложбена сала + заедница на македонски дизајнери и занаетчии. 15+ локални брендови.',
        en: 'Exhibition hall + community of Macedonian designers & craftspeople. 15+ local brands.',
      },
      rentable: false,
    },
    {
      name: { mk: 'Lab Re:store', en: 'Lab Re:store' },
      slug: 'lab-restore',
      use: {
        mk: 'Мал маркет за препроцесирање и репурпозирање на постара мода и акцесоари.',
        en: 'Small market for repurposing and upcycling older fashion articles and accessories.',
      },
      rentable: false,
    },
  ]

  for (const spaceData of spacesData) {
    const existing = await payload.find({ collection: 'spaces', where: { slug: { equals: spaceData.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'spaces',
        context: { disableRevalidate: true },
        data: { ...spaceData, _status: 'published' },
      })
      console.log(`  ✓ Space: ${spaceData.slug}`)
    } else {
      console.log(`  · Space exists: ${spaceData.slug}`)
    }
  }

  // ── Events (3 sample) ───────────────────────────────────────────────────────
  const now = new Date()
  const eventsData = [
    {
      title: { mk: 'Отворање на сезоната — Laboratorium Live', en: 'Season Opening — Laboratorium Live' },
      slug: 'otvoranje-sezona-2025',
      type: 'concert',
      startDateTime: new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString(),
      summary: {
        mk: 'Прва вечер на новата сезона — жива музика, дружење и новини од Laboratorium.',
        en: 'First evening of the new season — live music, socializing and news from Laboratorium.',
      },
      featured: true,
    },
    {
      title: { mk: 'Работилница за творечко пишување', en: 'Creative Writing Workshop' },
      slug: 'rabotilnica-pisuvanje-2025',
      type: 'workshop',
      startDateTime: new Date(now.getTime() + 14 * 24 * 3600 * 1000).toISOString(),
      summary: {
        mk: 'Со инструктори Марија Бошковска, Ивана Смилевска и Дарко Алексовски — во соработка со Дума ин Сума.',
        en: 'With instructors Marija Boškovska, Ivana Smilevska and Darko Aleksovski — in collaboration with Duma in Summa.',
      },
      featured: false,
    },
    {
      title: { mk: 'Концерт — Музички ансамбл', en: 'Concert — Music Ensemble' },
      slug: 'koncert-muzicki-ansambl-minato',
      type: 'concert',
      startDateTime: new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString(),
      summary: {
        mk: 'Конечен концерт на музичкиот ансамбл — млади музичари кои наоѓаат свој звук.',
        en: 'Final concert of the music ensemble — young musicians finding their sound.',
      },
      featured: false,
    },
  ]

  for (const eventData of eventsData) {
    const existing = await payload.find({ collection: 'events', where: { slug: { equals: eventData.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'events',
        context: { disableRevalidate: true },
        data: { ...eventData, _status: 'published' },
      })
      console.log(`  ✓ Event: ${eventData.slug}`)
    } else {
      console.log(`  · Event exists: ${eventData.slug}`)
    }
  }

  // ── Projects ─────────────────────────────────────────────────────────────────
  const projectsData = [
    {
      title: {
        mk: 'Музички ансамбл',
        en: 'Music Ensemble',
      },
      slug: 'muzicki-ansambl',
      status: 'ongoing',
      summary: {
        mk: 'Им помага на млади музичари да ја напуштат гаражата и да наоѓаат бендовски-другари, борејќи се со изолираната "микро-космос" пријателска клупска култура на градот.',
        en: 'Helps young musicians leave the garage and find bandmates, countering the city\'s isolated "micro-cosmos" friend-group culture.',
      },
    },
    {
      title: {
        mk: '"Безимена" работилница за творечко пишување',
        en: '"Unnamed" Creative Writing Workshop',
      },
      slug: 'bezimena-rabotilnica-pisuvanje',
      status: 'ongoing',
      summary: {
        mk: 'Во домаќинство на Дума ин Сума — со инструктори Марија Бошковска, Ивана Смилевска и Дарко Алексовски.',
        en: 'Hosted with Duma in Summa; instructors Marija Boškovska, Ivana Smilevska, and Darko Aleksovski.',
      },
      collaborators: [
        { name: 'Дума ин Сума', url: '' },
        { name: 'Марија Бошковска', role: 'Инструктор' },
        { name: 'Ивана Смилевска', role: 'Инструктор' },
        { name: 'Дарко Алексовски', role: 'Инструктор' },
      ],
    },
    {
      title: {
        mk: 'Летни мулти-настани',
        en: 'Summer Multi-Events',
      },
      slug: 'letni-multi-nastani',
      status: 'upcoming',
      summary: {
        mk: 'Изложби, документарци, денс-партии и читање книги за луѓето кои летото го поминуваат во Скопје — нешто за сите генерации.',
        en: 'Exhibitions, documentaries, dance parties, and book readings for people spending summer in Skopje; something for all generations.',
      },
    },
    {
      title: {
        mk: 'Занаетчиски програми',
        en: 'Craft & Artisan Programs',
      },
      slug: 'zanaetkiski-programi',
      status: 'ongoing',
      summary: {
        mk: 'Преку Lab Design Market и Lab Re:store — заживување на македонскиот занает и дизајн.',
        en: 'Via Lab Design Market & Lab Re:store — revival of Macedonian crafts and artisanal work.',
      },
    },
  ]

  for (const projectData of projectsData) {
    const existing = await payload.find({ collection: 'projects', where: { slug: { equals: projectData.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: { ...projectData, _status: 'published' },
      })
      console.log(`  ✓ Project: ${projectData.slug}`)
    } else {
      console.log(`  · Project exists: ${projectData.slug}`)
    }
  }

  // ── Sample Vendors ────────────────────────────────────────────────────────────
  const vendorsData = [
    {
      name: 'Мајстор × Пример',
      slug: 'majstor-primer',
      craft: { mk: 'Керамика', en: 'Ceramics' },
      bio: {
        mk: '[Пример] Рачно изработени керамики со традиционални македонски мотиви.',
        en: '[Placeholder] Handcrafted ceramics with traditional Macedonian motifs.',
      },
    },
    {
      name: 'Дизајн × Пример',
      slug: 'dizajn-primer',
      craft: { mk: 'Текстилен дизајн', en: 'Textile Design' },
      bio: {
        mk: '[Пример] Ткаени производи и ткаенини инспирирани од македонска народна уметност.',
        en: '[Placeholder] Woven goods and textiles inspired by Macedonian folk art.',
      },
    },
  ]

  for (const vendorData of vendorsData) {
    const existing = await payload.find({ collection: 'vendors', where: { slug: { equals: vendorData.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'vendors',
        context: { disableRevalidate: true },
        data: { ...vendorData, _status: 'published' },
      })
      console.log(`  ✓ Vendor: ${vendorData.slug}`)
    } else {
      console.log(`  · Vendor exists: ${vendorData.slug}`)
    }
  }

  // ── Sample News Post ──────────────────────────────────────────────────────────
  const postExisting = await payload.find({ collection: 'posts', where: { slug: { equals: 'laboratorium-otvoranje' } }, limit: 1 })
  if (postExisting.totalDocs === 0) {
    await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title: 'Laboratorium отвора врати — Декември 2024',
        slug: 'laboratorium-otvoranje',
        publishedAt: '2024-12-01T12:00:00.000Z',
        _status: 'published',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Laboratorium е слободен едукативен и културен центар во Скопје, посветен на уметноста, занаетот и заедницата.',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })
    console.log('  ✓ News post: laboratorium-otvoranje')
  } else {
    console.log('  · News post exists.')
  }

  console.log('')
  console.log('🎉 Seed complete!')
  console.log('')
  console.log(`   Admin panel: ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin`)
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPass}`)
  console.log('')
  console.log('   ⚠  Change the admin password after first login!')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
