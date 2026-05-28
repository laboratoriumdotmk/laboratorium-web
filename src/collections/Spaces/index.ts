import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidatePath } from 'next/cache'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  labels: { singular: 'Space', plural: 'Spaces' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sizeSqm', 'rentable', '_status'],
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
    sizeSqm: true,
    use: true,
    images: true,
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
          revalidatePath('/spaces')
          revalidatePath('/')
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Space Name',
      localized: true,
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
        description: 'URL-friendly identifier, e.g. "lab-factory"',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sizeSqm',
          type: 'number',
          label: 'Size (m²)',
          admin: { width: '50%' },
        },
        {
          name: 'capacity',
          type: 'number',
          label: 'Capacity (persons, optional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'use',
      type: 'textarea',
      label: 'Short Description / Use',
      localized: true,
      admin: {
        description: 'One or two sentences describing what this space is used for.',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Photos',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'rentable',
      type: 'checkbox',
      label: 'Available for Rental',
      defaultValue: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { hidden: true },
    },
  ],
}
