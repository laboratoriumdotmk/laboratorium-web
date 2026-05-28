import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { defaultLexical } from '@/fields/defaultLexical'
import { revalidateEvent, revalidateEventDelete } from './hooks/revalidateEvent'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getServerSideURL } from '@/utilities/getURL'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDateTime', 'type', 'status', 'featured'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({ slug: data?.slug as string, collection: 'events' })
        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({ slug: data?.slug as string, collection: 'events' })
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
    title: true,
    slug: true,
    startDateTime: true,
    type: true,
    featuredImage: true,
    summary: true,
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateEvent],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateEventDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Event Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
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
                description: 'Auto-generated from title. Used in the URL: /programs/[slug]',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      const title = typeof data.title === 'string' ? data.title : (data.title as any)?.mk || ''
                      return title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'type',
              type: 'select',
              label: 'Event Type',
              required: true,
              options: [
                { label: 'Workshop', value: 'workshop' },
                { label: 'Concert', value: 'concert' },
                { label: 'Exhibition', value: 'exhibition' },
                { label: 'Screening', value: 'screening' },
                { label: 'Seminar', value: 'seminar' },
                { label: 'Party / Social', value: 'party' },
                { label: 'Market', value: 'market' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDateTime',
                  type: 'date',
                  label: 'Start',
                  required: true,
                  admin: {
                    date: { pickerAppearance: 'dayAndTime' },
                    width: '50%',
                  },
                },
                {
                  name: 'endDateTime',
                  type: 'date',
                  label: 'End (optional)',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime' },
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'space',
              type: 'relationship',
              relationTo: 'spaces',
              label: 'Space / Venue',
              admin: {
                description: 'Which Laboratorium space hosts this event?',
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Short Summary',
              localized: true,
              admin: {
                description: 'One or two sentences shown on event cards.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Full Description',
              localized: true,
              editor: defaultLexical,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
            },
          ],
        },
        {
          label: 'Links & Partners',
          fields: [
            {
              name: 'ticketUrl',
              type: 'text',
              label: 'Ticket / RSVP URL (optional)',
            },
            {
              name: 'partners',
              type: 'array',
              label: 'Partners',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Partner Name',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL (optional)',
                },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Featured on homepage',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'SEO Title',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'SEO Description',
                  localized: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'OG Image',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { hidden: true },
    },
  ],
}
