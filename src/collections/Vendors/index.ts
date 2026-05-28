import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidatePath } from 'next/cache'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getServerSideURL } from '@/utilities/getURL'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: { singular: 'Maker / Vendor', plural: 'Makers / Vendors' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'craft', 'joinedDate', '_status'],
    description: 'Makers and designers in the Lab Design Market.',
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({ slug: data?.slug as string, collection: 'vendors' })
        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({ slug: data?.slug as string, collection: 'vendors' })
      return `${getServerSideURL()}${path}`
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    craft: true,
    photo: true,
    bio: true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          revalidatePath(`/market/${doc.slug}`)
          revalidatePath('/market')
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Brand / Maker Name',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier for /market/[slug]',
      },
    },
    {
      name: 'craft',
      type: 'text',
      label: 'Craft / Category',
      localized: true,
      admin: {
        description: 'e.g. "Ceramics", "Textile Design", "Jewelry"',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Bio',
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo / Logo',
    },
    {
      type: 'group',
      name: 'socials',
      label: 'Social Links',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'website', type: 'text', label: 'Website URL' },
      ],
    },
    {
      name: 'joinedDate',
      type: 'date',
      label: 'Joined Date',
      admin: {
        description: 'When this maker joined Lab Design Market.',
      },
    },
    { name: 'publishedAt', type: 'date', admin: { hidden: true } },
  ],
}
