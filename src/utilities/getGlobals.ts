import configPromise from '@payload-config'
import { type GlobalSlug, type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getGlobal<T extends GlobalSlug>(slug: T, depth = 0, locale = 'mk'): Promise<DataFromGlobalSlug<T> | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const global = await payload.findGlobal({ slug, depth, locale: locale as any })
    return global
  } catch {
    return null
  }
}

export const getCachedGlobal = <T extends GlobalSlug>(slug: T, depth = 0, locale = 'mk') =>
  unstable_cache(async () => getGlobal<T>(slug, depth, locale), [String(slug), locale], {
    tags: [`global_${String(slug)}`],
  })
