import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateEvent: CollectionAfterChangeHook = ({ doc, previousDoc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/programs/${doc.slug}`
      payload.logger.info(`Revalidating event at path: ${path}`)
      revalidatePath(path)
      revalidatePath('/programs')
      revalidatePath('/')
      revalidateTag('events-sitemap', 'max')
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/programs/${previousDoc.slug}`
      payload.logger.info(`Revalidating old event path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidatePath('/programs')
      revalidatePath('/')
    }
  }
  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook = ({ doc, req: { payload } }) => {
  const path = `/programs/${doc?.slug}`
  payload.logger.info(`Revalidating deleted event: ${path}`)
  revalidatePath(path)
  revalidatePath('/programs')
  revalidatePath('/')
  revalidateTag('events-sitemap', 'max')
  return doc
}
