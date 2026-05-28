import configPromise from '@payload-config'
import { type GlobalSlug, type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getGlobal<T extends GlobalSlug>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T> | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const global = await payload.findGlobal({ slug, depth })
    return global
  } catch {
    return null
  }
}

export const getCachedGlobal = <T extends GlobalSlug>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, depth), [String(slug)], {
    tags: [`global_${String(slug)}`],
  })
