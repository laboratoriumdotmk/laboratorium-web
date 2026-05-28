import configPromise from '@payload-config'
import { type CollectionSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getDocument(collection: CollectionSlug, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

export const getCachedDocument = (collection: CollectionSlug, slug: string) =>
  unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })
